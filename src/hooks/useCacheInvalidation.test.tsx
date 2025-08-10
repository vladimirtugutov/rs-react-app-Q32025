import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useCacheInvalidation } from './useCacheInvalidation';
import { booksApi } from '../store/api/booksApi';

vi.mock('../store/api/booksApi', () => ({
  booksApi: {
    reducerPath: 'booksApi',
    reducer: vi.fn(() => ({})),
    middleware: vi.fn(
      () => (next: (action: unknown) => unknown) => (action: unknown) =>
        next(action)
    ),
    util: {
      invalidateTags: vi.fn(),
    },
  },
}));

const mockDispatch = vi.fn();

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

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

describe('useCacheInvalidation', () => {
  let mockInvalidateTags: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockDispatch.mockImplementation(() => undefined);

    mockInvalidateTags = vi.fn();
    vi.mocked(booksApi.util.invalidateTags).mockImplementation(
      mockInvalidateTags
    );
  });

  describe('Hook Initialization', () => {
    it('should return all required methods', () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      expect(result.current.refreshBooks).toBeDefined();
      expect(result.current.refreshBookDetails).toBeDefined();
      expect(result.current.refreshAll).toBeDefined();

      expect(typeof result.current.refreshBooks).toBe('function');
      expect(typeof result.current.refreshBookDetails).toBe('function');
      expect(typeof result.current.refreshAll).toBe('function');
    });

    it('should maintain stable function types', () => {
      const { result, rerender } = renderHook(() => useCacheInvalidation(), {
        wrapper,
      });

      const firstTypes = {
        refreshBooks: typeof result.current.refreshBooks,
        refreshBookDetails: typeof result.current.refreshBookDetails,
        refreshAll: typeof result.current.refreshAll,
      };

      rerender();

      expect(typeof result.current.refreshBooks).toBe(firstTypes.refreshBooks);
      expect(typeof result.current.refreshBookDetails).toBe(
        firstTypes.refreshBookDetails
      );
      expect(typeof result.current.refreshAll).toBe(firstTypes.refreshAll);
    });
  });

  describe('refreshBooks', () => {
    it('should dispatch invalidateTags with Books tag', () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      result.current.refreshBooks();

      expect(mockInvalidateTags).toHaveBeenCalledWith(['Books']);
      expect(mockInvalidateTags).toHaveBeenCalledTimes(1);
    });

    it('should dispatch action through Redux dispatch', () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      const mockAction = { type: 'invalidate', payload: ['Books'] };
      mockInvalidateTags.mockReturnValue(mockAction);

      result.current.refreshBooks();

      expect(mockDispatch).toHaveBeenCalledWith(mockAction);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('should call refreshBooks multiple times correctly', () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      result.current.refreshBooks();
      result.current.refreshBooks();
      result.current.refreshBooks();

      expect(mockInvalidateTags).toHaveBeenCalledTimes(3);
      expect(mockInvalidateTags).toHaveBeenNthCalledWith(1, ['Books']);
      expect(mockInvalidateTags).toHaveBeenNthCalledWith(2, ['Books']);
      expect(mockInvalidateTags).toHaveBeenNthCalledWith(3, ['Books']);
    });
  });

  describe('refreshBookDetails', () => {
    it('should dispatch invalidateTags with specific bookId when provided', () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      result.current.refreshBookDetails('OL123456W');

      expect(mockInvalidateTags).toHaveBeenCalledWith([
        { type: 'BookDetails', id: 'OL123456W' },
      ]);
      expect(mockInvalidateTags).toHaveBeenCalledTimes(1);
    });

    it('should dispatch invalidateTags with all BookDetails when bookId is not provided', () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      result.current.refreshBookDetails();

      expect(mockInvalidateTags).toHaveBeenCalledWith(['BookDetails']);
      expect(mockInvalidateTags).toHaveBeenCalledTimes(1);
    });

    it('should dispatch invalidateTags with all BookDetails when bookId is undefined', () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      result.current.refreshBookDetails(undefined);

      expect(mockInvalidateTags).toHaveBeenCalledWith(['BookDetails']);
      expect(mockInvalidateTags).toHaveBeenCalledTimes(1);
    });

    it('should dispatch invalidateTags with all BookDetails when bookId is empty string', () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      result.current.refreshBookDetails('');

      expect(mockInvalidateTags).toHaveBeenCalledWith(['BookDetails']);
      expect(mockInvalidateTags).toHaveBeenCalledTimes(1);
    });

    it('should handle different bookId formats', () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      const testCases = [
        'OL123456W',
        'OL789012W',
        'simple-id',
        '12345',
        'book-with-dashes',
        'BOOK_WITH_UNDERSCORES',
      ];

      testCases.forEach((bookId, index) => {
        result.current.refreshBookDetails(bookId);

        expect(mockInvalidateTags).toHaveBeenNthCalledWith(index + 1, [
          { type: 'BookDetails', id: bookId },
        ]);
      });

      expect(mockInvalidateTags).toHaveBeenCalledTimes(testCases.length);
    });

    it('should dispatch action through Redux dispatch with bookId', () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      const mockAction = {
        type: 'invalidate',
        payload: [{ type: 'BookDetails', id: 'OL123456W' }],
      };
      mockInvalidateTags.mockReturnValue(mockAction);

      result.current.refreshBookDetails('OL123456W');

      expect(mockDispatch).toHaveBeenCalledWith(mockAction);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('should dispatch action through Redux dispatch without bookId', () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      const mockAction = {
        type: 'invalidate',
        payload: ['BookDetails'],
      };
      mockInvalidateTags.mockReturnValue(mockAction);

      result.current.refreshBookDetails();

      expect(mockDispatch).toHaveBeenCalledWith(mockAction);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });
  });

  describe('refreshAll', () => {
    it('should dispatch invalidateTags with both Books and BookDetails tags', () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      result.current.refreshAll();

      expect(mockInvalidateTags).toHaveBeenCalledWith(['Books', 'BookDetails']);
      expect(mockInvalidateTags).toHaveBeenCalledTimes(1);
    });

    it('should dispatch action through Redux dispatch', () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      const mockAction = {
        type: 'invalidate',
        payload: ['Books', 'BookDetails'],
      };
      mockInvalidateTags.mockReturnValue(mockAction);

      result.current.refreshAll();

      expect(mockDispatch).toHaveBeenCalledWith(mockAction);
      expect(mockDispatch).toHaveBeenCalledTimes(1);
    });

    it('should call refreshAll multiple times correctly', () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      result.current.refreshAll();
      result.current.refreshAll();

      expect(mockInvalidateTags).toHaveBeenCalledTimes(2);
      expect(mockInvalidateTags).toHaveBeenNthCalledWith(1, [
        'Books',
        'BookDetails',
      ]);
      expect(mockInvalidateTags).toHaveBeenNthCalledWith(2, [
        'Books',
        'BookDetails',
      ]);
    });
  });

  describe('Method Combinations', () => {
    it('should handle calling different methods in sequence', () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      result.current.refreshBooks();
      result.current.refreshBookDetails('OL123456W');
      result.current.refreshAll();

      expect(mockInvalidateTags).toHaveBeenCalledTimes(3);
      expect(mockInvalidateTags).toHaveBeenNthCalledWith(1, ['Books']);
      expect(mockInvalidateTags).toHaveBeenNthCalledWith(2, [
        { type: 'BookDetails', id: 'OL123456W' },
      ]);
      expect(mockInvalidateTags).toHaveBeenNthCalledWith(3, [
        'Books',
        'BookDetails',
      ]);
    });

    it('should handle mixed calls with and without bookId', () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      result.current.refreshBookDetails('OL123456W');
      result.current.refreshBookDetails();
      result.current.refreshBookDetails('OL789012W');

      expect(mockInvalidateTags).toHaveBeenCalledTimes(3);
      expect(mockInvalidateTags).toHaveBeenNthCalledWith(1, [
        { type: 'BookDetails', id: 'OL123456W' },
      ]);
      expect(mockInvalidateTags).toHaveBeenNthCalledWith(2, ['BookDetails']);
      expect(mockInvalidateTags).toHaveBeenNthCalledWith(3, [
        { type: 'BookDetails', id: 'OL789012W' },
      ]);
    });
  });

  describe('Error Handling', () => {
    it('should handle dispatch errors gracefully', () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      mockDispatch.mockImplementation(() => {
        throw new Error('Dispatch error');
      });

      expect(() => result.current.refreshBooks()).toThrow('Dispatch error');
    });

    it('should handle invalidateTags errors gracefully', () => {
      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      mockInvalidateTags.mockImplementation(() => {
        throw new Error('InvalidateTags error');
      });

      expect(() => result.current.refreshBooks()).toThrow(
        'InvalidateTags error'
      );
    });
  });

  describe('Integration with Redux', () => {
    it('should work with real Redux store', () => {
      mockDispatch.mockImplementation(() => undefined);

      const realStore = createMockStore();
      const realWrapper = ({ children }: { children: React.ReactNode }) => (
        <Provider store={realStore}>{children}</Provider>
      );

      const { result } = renderHook(() => useCacheInvalidation(), {
        wrapper: realWrapper,
      });

      expect(() => {
        result.current.refreshBooks();
        result.current.refreshBookDetails('OL123456W');
        result.current.refreshAll();
      }).not.toThrow();
    });
  });

  describe('Type Safety', () => {
    it('should maintain correct return types', () => {
      mockDispatch.mockImplementation(() => undefined);

      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      expect(typeof result.current.refreshBooks).toBe('function');
      expect(typeof result.current.refreshBookDetails).toBe('function');
      expect(typeof result.current.refreshAll).toBe('function');

      expect(() => result.current.refreshBooks()).not.toThrow();
      expect(() => result.current.refreshBookDetails()).not.toThrow();
      expect(() => result.current.refreshBookDetails('test')).not.toThrow();
      expect(() => result.current.refreshAll()).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null bookId', () => {
      mockDispatch.mockImplementation(() => undefined);

      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      result.current.refreshBookDetails(null as unknown as string | undefined);

      expect(mockInvalidateTags).toHaveBeenCalledWith(['BookDetails']);
    });

    it('should handle special characters in bookId', () => {
      mockDispatch.mockImplementation(() => undefined);

      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      const specialIds = [
        'book-with-дashes',
        'book_with_underscores',
        'book.with.dots',
        'book@with@symbols',
        'book with spaces',
        '12345',
        'UPPERCASE_ID',
      ];

      specialIds.forEach((bookId, index) => {
        result.current.refreshBookDetails(bookId);

        expect(mockInvalidateTags).toHaveBeenNthCalledWith(index + 1, [
          { type: 'BookDetails', id: bookId },
        ]);
      });
    });

    it('should handle very long bookId', () => {
      mockDispatch.mockImplementation(() => undefined);

      const { result } = renderHook(() => useCacheInvalidation(), { wrapper });

      const longBookId = 'a'.repeat(1000);
      result.current.refreshBookDetails(longBookId);

      expect(mockInvalidateTags).toHaveBeenCalledWith([
        { type: 'BookDetails', id: longBookId },
      ]);
    });
  });
});
