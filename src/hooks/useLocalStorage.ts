'use client';
import { useState, useEffect } from 'react';
import { IS_CLIENT, IS_SERVER } from '@/constants/environment';

function readStoredValue<T>(key: string, initialValue: T): T {
  if (IS_SERVER) {
    return initialValue;
  }

  try {
    const item = window.localStorage.getItem(key);

    if (item === null) {
      return initialValue;
    }

    if (typeof initialValue === 'string') {
      return item as T;
    }

    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return initialValue;
  }
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // One-time sync from localStorage after mount. SSR always renders
    // `initialValue` (localStorage is unavailable on the server), so the
    // real stored value can only be read once the component is mounted
    // in the browser. This intentionally runs once per `key` change to
    // keep SSR output and the first client render in sync, avoiding a
    // hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStoredValue(readStoredValue(key, initialValue));
    setIsHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (IS_CLIENT) {
        if (typeof valueToStore === 'string') {
          window.localStorage.setItem(key, valueToStore);
        } else {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, isHydrated] as const;
}
