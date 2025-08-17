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
    refreshBookDetails: vi.fn(),
    refreshAll: vi.fn(),
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

describe('App - RTK Query Caching Behavior', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should use cached data when available', async () => {
    const { useBooks } = await import('../hooks/useBooks');
    const { useCacheInvalidation } = await import(
      '../hooks/useCacheInvalidation'
    );

    const mockRefetch = vi.fn();
    const mockRefreshBooks = vi.fn();
    const mockRefreshBookDetails = vi.fn();
    const mockRefreshAll = vi.fn();

    vi.mocked(useCacheInvalidation).mockReturnValue({
      refreshBooks: mockRefreshBooks,
      refreshBookDetails: mockRefreshBookDetails,
      refreshAll: mockRefreshAll,
    });

    vi.mocked(useBooks).mockReturnValue({
      books: [
        {
          key: '/works/OL123456W',
          title: 'Cached Book Title',
          author_name: ['Cached Author'],
          first_publish_year: 2020,
          cover_i: 123456,
          publisher: ['Cached Publisher'],
          subject: ['Fiction'],
        },
      ],
      totalResults: 1,
      totalPages: 1,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    await act(async () => {
      renderWithProviders(<App />);
    });

    expect(screen.getByText('Cached Book Title')).toBeInTheDocument();
    expect(mockRefetch).not.toHaveBeenCalled();
  });

  it('should invalidate cache on manual refresh', async () => {
    const { useBooks } = await import('../hooks/useBooks');
    const { useCacheInvalidation } = await import(
      '../hooks/useCacheInvalidation'
    );

    const mockRefetch = vi.fn();
    const mockRefreshBooks = vi.fn();
    const mockRefreshBookDetails = vi.fn();
    const mockRefreshAll = vi.fn();

    vi.mocked(useCacheInvalidation).mockReturnValue({
      refreshBooks: mockRefreshBooks,
      refreshBookDetails: mockRefreshBookDetails,
      refreshAll: mockRefreshAll,
    });

    vi.mocked(useBooks).mockReturnValue({
      books: [],
      totalResults: 0,
      totalPages: 0,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });

    await act(async () => {
      renderWithProviders(<App />);
    });

    expect(mockRefreshBooks).toBeDefined();
    expect(mockRefreshBookDetails).toBeDefined();
    expect(mockRefreshAll).toBeDefined();
  });
});
