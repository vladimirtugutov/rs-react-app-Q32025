import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

describe('useLocalStorage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Initialization', () => {
    it('should return initial value when localStorage is empty', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial-value')
      );

      expect(result.current[0]).toBe('initial-value');
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
    });

    it('should return stored string value from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('stored-value');

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial-value')
      );

      expect(result.current[0]).toBe('stored-value');
    });

    it('should return parsed JSON value from localStorage for non-string types', () => {
      const storedObject = { name: 'test', count: 42 };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedObject));

      const { result } = renderHook(() =>
        useLocalStorage('test-key', { name: '', count: 0 })
      );

      expect(result.current[0]).toEqual(storedObject);
    });

    it('should return parsed JSON array from localStorage', () => {
      const storedArray = ['item1', 'item2', 'item3'];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedArray));

      const { result } = renderHook(() =>
        useLocalStorage('test-key', [] as string[])
      );

      expect(result.current[0]).toEqual(storedArray);
    });

    it('should return parsed JSON number from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('42');

      const { result } = renderHook(() => useLocalStorage('test-key', 0));

      expect(result.current[0]).toBe(42);
    });

    it('should return initial value when localStorage contains invalid JSON', () => {
      mockLocalStorage.getItem.mockReturnValue('invalid-json{');
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { result } = renderHook(() =>
        useLocalStorage('test-key', { default: true })
      );

      expect(result.current[0]).toEqual({ default: true });
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error reading localStorage key "test-key":',
        expect.any(Error)
      );
    });

    it('should handle localStorage getItem throwing an error', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage not available');
      });
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'fallback')
      );

      expect(result.current[0]).toBe('fallback');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error reading localStorage key "test-key":',
        expect.any(Error)
      );
    });
  });

  describe('Setting values', () => {
    it('should update state and localStorage with string value', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      );

      act(() => {
        result.current[1]('new-value');
      });

      expect(result.current[0]).toBe('new-value');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        'new-value'
      );
    });

    it('should update state and localStorage with object value using JSON.stringify', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      const newObject = { name: 'test', value: 123 };

      const { result } = renderHook(() =>
        useLocalStorage('test-key', { name: '', value: 0 })
      );

      act(() => {
        result.current[1](newObject);
      });

      expect(result.current[0]).toEqual(newObject);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(newObject)
      );
    });

    it('should update state and localStorage with array value using JSON.stringify', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      const newArray = ['a', 'b', 'c'];

      const { result } = renderHook(() =>
        useLocalStorage('test-key', [] as string[])
      );

      act(() => {
        result.current[1](newArray);
      });

      expect(result.current[0]).toEqual(newArray);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(newArray)
      );
    });

    it('should update state and localStorage with number value using JSON.stringify', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() => useLocalStorage('test-key', 0));

      act(() => {
        result.current[1](42);
      });

      expect(result.current[0]).toBe(42);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify(42)
      );
    });

    it('should work with function updater for strings', () => {
      mockLocalStorage.getItem.mockReturnValue('hello');

      const { result } = renderHook(() => useLocalStorage('test-key', ''));

      act(() => {
        result.current[1]((prev) => prev + ' world');
      });

      expect(result.current[0]).toBe('hello world');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        'hello world'
      );
    });

    it('should work with function updater for objects', () => {
      const initialObject = { count: 5 };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(initialObject));

      const { result } = renderHook(() =>
        useLocalStorage('test-key', { count: 0 })
      );

      act(() => {
        result.current[1]((prev) => ({ ...prev, count: prev.count + 1 }));
      });

      expect(result.current[0]).toEqual({ count: 6 });
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify({ count: 6 })
      );
    });

    it('should handle localStorage setItem throwing an error', () => {
      mockLocalStorage.getItem.mockReturnValue(null);
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('localStorage quota exceeded');
      });
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      );

      act(() => {
        result.current[1]('new-value');
      });

      expect(result.current[0]).toBe('new-value');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error setting localStorage key "test-key":',
        expect.any(Error)
      );
    });
  });

  describe('Type safety', () => {
    it('should maintain type safety for string values', () => {
      mockLocalStorage.getItem.mockReturnValue('test');

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'initial')
      );

      expect(typeof result.current[0]).toBe('string');
    });

    it('should maintain type safety for object values', () => {
      const testObject = { name: 'test', active: true };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(testObject));

      const { result } = renderHook(() =>
        useLocalStorage('test-key', { name: '', active: false })
      );

      expect(typeof result.current[0]).toBe('object');
      expect(result.current[0]).toHaveProperty('name');
      expect(result.current[0]).toHaveProperty('active');
    });

    it('should maintain type safety for array values', () => {
      const testArray = [1, 2, 3];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(testArray));

      const { result } = renderHook(() =>
        useLocalStorage('test-key', [] as number[])
      );

      expect(Array.isArray(result.current[0])).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty string as valid value', () => {
      mockLocalStorage.getItem.mockReturnValue('');

      const { result } = renderHook(() =>
        useLocalStorage('test-key', 'default')
      );

      expect(result.current[0]).toBe('');
    });

    it('should handle null values correctly', () => {
      mockLocalStorage.getItem.mockReturnValue('null');

      const { result } = renderHook(() =>
        useLocalStorage('test-key', { value: 'default' })
      );

      expect(result.current[0]).toBe(null);
    });

    it('should handle boolean values correctly', () => {
      mockLocalStorage.getItem.mockReturnValue('true');

      const { result } = renderHook(() => useLocalStorage('test-key', false));

      expect(result.current[0]).toBe(true);
    });

    it('should handle undefined values by using initial value', () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const { result } = renderHook(() =>
        useLocalStorage('test-key', undefined)
      );

      expect(result.current[0]).toBe(undefined);
    });
  });

  describe('Multiple hook instances', () => {
    it('should work independently with different keys', () => {
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'key1') return 'value1';
        if (key === 'key2') return JSON.stringify({ data: 'value2' });
        return null;
      });

      const { result: result1 } = renderHook(() => useLocalStorage('key1', ''));
      const { result: result2 } = renderHook(() =>
        useLocalStorage('key2', { data: '' })
      );

      expect(result1.current[0]).toBe('value1');
      expect(result2.current[0]).toEqual({ data: 'value2' });
    });
  });
});
