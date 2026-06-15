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

describe('App - RTK Query Loading States', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading spinner during book search', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: [],
      totalResults: 0,
      totalPages: 0,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    await act(async () => {
      renderWithProviders(<App />);
    });

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveClass('spinner-container');
    expect(screen.getByRole('status')).toHaveAttribute('aria-busy', 'true');
  });

  it('should hide loading spinner when data is loaded', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: [
        {
          key: '/works/OL123456W',
          title: 'Test Book',
          author_name: ['Test Author'],
          first_publish_year: 2020,
          cover_i: 123456,
          publisher: ['Test Publisher'],
          subject: ['Fiction'],
        },
      ],
      totalResults: 1,
      totalPages: 1,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    await act(async () => {
      renderWithProviders(<App />);
    });

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByText('Test Book')).toBeInTheDocument();
  });

  it('should show loading during pagination change', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    const mockUseBooks = vi.mocked(useBooks);
    mockUseBooks.mockReturnValue({
      books: [],
      totalResults: 100,
      totalPages: 10,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    await act(async () => {
      renderWithProviders(<App />);
    });

    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
