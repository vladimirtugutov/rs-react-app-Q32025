import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useBooks } from './useBooks';
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
  useGetBooksQuery: vi.fn(),
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

describe('useBooks', async () => {
  const { useGetBooksQuery } = await import('../store/api/booksApi');
  const mockUseGetBooksQuery = vi.mocked(useGetBooksQuery);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic Functionality', () => {
    it('should return default values when no data is provided', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(
        () => useBooks({ searchTerm: 'test', page: 1 }),
        { wrapper }
      );

      expect(result.current.books).toEqual([]);
      expect(result.current.totalResults).toBe(0);
      expect(result.current.totalPages).toBe(0);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
      expect(result.current.refetch).toBeDefined();
    });

    it('should return books data when query succeeds', () => {
      const mockBooks = [
        {
          key: '/works/OL123456W',
          title: 'Test Book',
          author_name: ['Test Author'],
          first_publish_year: 2020,
          cover_i: 123456,
          publisher: ['Test Publisher'],
          subject: ['Fiction'],
        },
      ];

      const mockData = {
        books: mockBooks,
        totalResults: 25,
        totalPages: 3,
      };

      mockUseGetBooksQuery.mockReturnValue({
        data: mockData,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(
        () => useBooks({ searchTerm: 'test', page: 1 }),
        { wrapper }
      );

      expect(result.current.books).toEqual(mockBooks);
      expect(result.current.totalResults).toBe(25);
      expect(result.current.totalPages).toBe(3);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should pass correct parameters to useGetBooksQuery', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderHook(() => useBooks({ searchTerm: 'react books', page: 2 }), {
        wrapper,
      });

      expect(mockUseGetBooksQuery).toHaveBeenCalledWith(
        { searchTerm: 'react books', page: 2 },
        { skip: false }
      );
    });
  });

  describe('Loading States', () => {
    it('should return true for isLoading when query is loading', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(
        () => useBooks({ searchTerm: 'test', page: 1 }),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should return true for isLoading when query is fetching', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: true,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(
        () => useBooks({ searchTerm: 'test', page: 1 }),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should return true for isLoading when both loading and fetching', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: undefined,
        isLoading: true,
        isFetching: true,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(
        () => useBooks({ searchTerm: 'test', page: 1 }),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should return false for isLoading when not loading or fetching', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: { books: [], totalResults: 0, totalPages: 0 },
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(
        () => useBooks({ searchTerm: 'test', page: 1 }),
        { wrapper }
      );

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should return error message when query fails', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        error: { message: 'Network error' },
        refetch: vi.fn(),
      });

      const { result } = renderHook(
        () => useBooks({ searchTerm: 'test', page: 1 }),
        { wrapper }
      );

      expect(result.current.error).toBe('Failed to fetch books');
      expect(result.current.books).toEqual([]);
      expect(result.current.totalResults).toBe(0);
      expect(result.current.totalPages).toBe(0);
    });

    it('should return null error when no query error', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: { books: [], totalResults: 0, totalPages: 0 },
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(
        () => useBooks({ searchTerm: 'test', page: 1 }),
        { wrapper }
      );

      expect(result.current.error).toBe(null);
    });

    it('should handle undefined error', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: { books: [], totalResults: 0, totalPages: 0 },
        isLoading: false,
        isFetching: false,
        error: undefined,
        refetch: vi.fn(),
      });

      const { result } = renderHook(
        () => useBooks({ searchTerm: 'test', page: 1 }),
        { wrapper }
      );

      expect(result.current.error).toBe(null);
    });
  });

  describe('Parameters Handling', () => {
    it('should use empty string as default searchTerm', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderHook(() => useBooks({ page: 1 }), { wrapper });

      expect(mockUseGetBooksQuery).toHaveBeenCalledWith(
        { searchTerm: '', page: 1 },
        { skip: false }
      );
    });

    it('should use provided searchTerm', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderHook(() => useBooks({ searchTerm: 'javascript', page: 1 }), {
        wrapper,
      });

      expect(mockUseGetBooksQuery).toHaveBeenCalledWith(
        { searchTerm: 'javascript', page: 1 },
        { skip: false }
      );
    });

    it('should use enabled=true as default', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderHook(() => useBooks({ page: 1 }), { wrapper });

      expect(mockUseGetBooksQuery).toHaveBeenCalledWith(
        { searchTerm: '', page: 1 },
        { skip: false }
      );
    });

    it('should handle enabled=false', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderHook(() => useBooks({ page: 1, enabled: false }), { wrapper });

      expect(mockUseGetBooksQuery).toHaveBeenCalledWith(
        { searchTerm: '', page: 1 },
        { skip: true }
      );
    });

    it('should handle enabled=true explicitly', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderHook(() => useBooks({ page: 1, enabled: true }), { wrapper });

      expect(mockUseGetBooksQuery).toHaveBeenCalledWith(
        { searchTerm: '', page: 1 },
        { skip: false }
      );
    });
  });

  describe('Data Structure Handling', () => {
    it('should handle empty books array in data', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: {
          books: [],
          totalResults: 0,
          totalPages: 0,
        },
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(
        () => useBooks({ searchTerm: 'test', page: 1 }),
        { wrapper }
      );

      expect(result.current.books).toEqual([]);
      expect(result.current.totalResults).toBe(0);
      expect(result.current.totalPages).toBe(0);
    });

    it('should handle partial data object', () => {
      type PartialBooksData = {
        books: undefined;
        totalResults: undefined;
        totalPages: undefined;
      };

      mockUseGetBooksQuery.mockReturnValue({
        data: {
          books: undefined,
          totalResults: undefined,
          totalPages: undefined,
        } as PartialBooksData,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(
        () => useBooks({ searchTerm: 'test', page: 1 }),
        { wrapper }
      );

      expect(result.current.books).toEqual([]);
      expect(result.current.totalResults).toBe(0);
      expect(result.current.totalPages).toBe(0);
    });

    it('should handle null data', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: null,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(
        () => useBooks({ searchTerm: 'test', page: 1 }),
        { wrapper }
      );

      expect(result.current.books).toEqual([]);
      expect(result.current.totalResults).toBe(0);
      expect(result.current.totalPages).toBe(0);
    });
  });

  describe('Refetch Functionality', () => {
    it('should return refetch function from query', () => {
      const mockRefetch = vi.fn();

      mockUseGetBooksQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: mockRefetch,
      });

      const { result } = renderHook(
        () => useBooks({ searchTerm: 'test', page: 1 }),
        { wrapper }
      );

      expect(result.current.refetch).toBe(mockRefetch);
    });

    it('should call refetch when invoked', () => {
      const mockRefetch = vi.fn();

      mockUseGetBooksQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: mockRefetch,
      });

      const { result } = renderHook(
        () => useBooks({ searchTerm: 'test', page: 1 }),
        { wrapper }
      );

      result.current.refetch();
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });
  });

  describe('Complex Scenarios', () => {
    it('should handle loading state with existing data', () => {
      const mockBooks = [
        {
          key: '/works/OL123456W',
          title: 'Existing Book',
          author_name: ['Existing Author'],
          first_publish_year: 2020,
        },
      ];

      mockUseGetBooksQuery.mockReturnValue({
        data: {
          books: mockBooks,
          totalResults: 1,
          totalPages: 1,
        },
        isLoading: false,
        isFetching: true,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(
        () => useBooks({ searchTerm: 'test', page: 2 }),
        { wrapper }
      );

      expect(result.current.books).toEqual(mockBooks);
      expect(result.current.isLoading).toBe(true);
      expect(result.current.totalResults).toBe(1);
    });

    it('should handle error with existing data', () => {
      const mockBooks = [
        {
          key: '/works/OL123456W',
          title: 'Cached Book',
          author_name: ['Cached Author'],
          first_publish_year: 2020,
        },
      ];

      mockUseGetBooksQuery.mockReturnValue({
        data: {
          books: mockBooks,
          totalResults: 1,
          totalPages: 1,
        },
        isLoading: false,
        isFetching: false,
        error: { message: 'Stale data error' },
        refetch: vi.fn(),
      });

      const { result } = renderHook(
        () => useBooks({ searchTerm: 'test', page: 1 }),
        { wrapper }
      );

      expect(result.current.books).toEqual(mockBooks);
      expect(result.current.error).toBe('Failed to fetch books');
      expect(result.current.totalResults).toBe(1);
    });

    it('should handle different page numbers', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderHook(() => useBooks({ searchTerm: 'test', page: 5 }), { wrapper });

      expect(mockUseGetBooksQuery).toHaveBeenCalledWith(
        { searchTerm: 'test', page: 5 },
        { skip: false }
      );
    });

    it('should handle special characters in searchTerm', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });

      renderHook(
        () => useBooks({ searchTerm: 'test "book" & author', page: 1 }),
        { wrapper }
      );

      expect(mockUseGetBooksQuery).toHaveBeenCalledWith(
        { searchTerm: 'test "book" & author', page: 1 },
        { skip: false }
      );
    });
  });

  describe('Type Safety', () => {
    it('should maintain correct return types', () => {
      mockUseGetBooksQuery.mockReturnValue({
        data: {
          books: [],
          totalResults: 0,
          totalPages: 0,
        },
        isLoading: false,
        isFetching: false,
        error: null,
        refetch: vi.fn(),
      });

      const { result } = renderHook(
        () => useBooks({ searchTerm: 'test', page: 1 }),
        { wrapper }
      );

      expect(Array.isArray(result.current.books)).toBe(true);
      expect(typeof result.current.totalResults).toBe('number');
      expect(typeof result.current.totalPages).toBe('number');
      expect(typeof result.current.isLoading).toBe('boolean');
      expect(typeof result.current.refetch).toBe('function');
      expect(
        result.current.error === null ||
          typeof result.current.error === 'string'
      ).toBe(true);
    });
  });
});
