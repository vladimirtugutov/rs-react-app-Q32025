import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useBookDetails } from './useBookDetails';
import { booksApi } from '../store/api/booksApi';

vi.mock('../store/api/booksApi', () => ({
  booksApi: {
    reducerPath: 'booksApi',
    reducer: vi.fn(() => ({})),
    middleware: vi.fn(
      () => (next: (action: unknown) => unknown) => (action: unknown) =>
        next(action)
    ),
  },
  useGetBookDetailsQuery: vi.fn(),
}));

const createMockStore = () => {
  return configureStore({
    reducer: {
      [booksApi.reducerPath]: booksApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(booksApi.middleware),
  });
};

const wrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createMockStore();
  return <Provider store={store}>{children}</Provider>;
};

describe('useBookDetails', async () => {
  const { useGetBookDetailsQuery } = await import('../store/api/booksApi');
  const mockUseGetBookDetailsQuery = vi.mocked(useGetBookDetailsQuery);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return null when no data provided', () => {
    mockUseGetBookDetailsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useBookDetails('OL123456W'), {
      wrapper,
    });

    expect(result.current.bookDetailsAPI).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should return book details when data exists', () => {
    const mockBookDetails = {
      title: 'Test Book',
      description: 'Test description',
      number_of_pages: 200,
    };

    mockUseGetBookDetailsQuery.mockReturnValue({
      data: mockBookDetails,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useBookDetails('OL123456W'), {
      wrapper,
    });

    expect(result.current.bookDetailsAPI).toEqual(mockBookDetails);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle error with status code', () => {
    mockUseGetBookDetailsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { status: 404 },
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useBookDetails('OL123456W'), {
      wrapper,
    });

    expect(result.current.error).toBe('Failed to fetch book details: 404');
    expect(result.current.bookDetailsAPI).toBe(null);
  });

  it('should skip query when detailsId is null', () => {
    mockUseGetBookDetailsQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderHook(() => useBookDetails(null), { wrapper });

    expect(mockUseGetBookDetailsQuery).toHaveBeenCalledWith('', {
      skip: true,
    });
  });

  it('should return loading state', () => {
    mockUseGetBookDetailsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    const { result } = renderHook(() => useBookDetails('OL123456W'), {
      wrapper,
    });

    expect(result.current.isLoading).toBe(true);
  });
});
