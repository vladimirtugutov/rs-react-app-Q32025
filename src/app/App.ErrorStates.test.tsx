import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { App } from './App';
import selectedItemsReducer from '../store/selectedItemsSlice';
import { booksApi } from '../store/api/booksApi';

vi.mock('../hooks/useBooks', () => ({
  useBooks: vi.fn(),
}));

vi.mock('../hooks/useCacheInvalidation', () => ({
  useCacheInvalidation: vi.fn(() => ({
    refreshBooks: vi.fn(),
  })),
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
      [booksApi.reducerPath]: booksApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(booksApi.middleware),
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(<Provider store={store}>{component}</Provider>);
};

describe('App - RTK Query Error States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should handle network error in book search', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: [],
      totalResults: 0,
      totalPages: 0,
      isLoading: false,
      error: 'Failed to fetch books',
      refetch: vi.fn(),
    });

    await act(async () => {
      renderWithProviders(<App />);
    });

    expect(screen.getByText(/Failed to fetch books/)).toBeInTheDocument();
  });

  it('should handle timeout error', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: [],
      totalResults: 0,
      totalPages: 0,
      isLoading: false,
      error: 'Request timeout',
      refetch: vi.fn(),
    });

    await act(async () => {
      renderWithProviders(<App />);
    });

    expect(screen.getByText(/Request timeout/)).toBeInTheDocument();
  });

  it('should handle 404 error', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: [],
      totalResults: 0,
      totalPages: 0,
      isLoading: false,
      error: 'API Error: 404',
      refetch: vi.fn(),
    });

    await act(async () => {
      renderWithProviders(<App />);
    });

    expect(screen.getByText(/API Error: 404/)).toBeInTheDocument();
  });
});
