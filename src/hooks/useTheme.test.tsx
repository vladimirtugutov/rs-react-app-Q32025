import React from 'react';
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useTheme } from './useTheme';
import { ThemeContext } from '../context/theme';

describe('useTheme hook', () => {
  it('should throw an error when used outside of ThemeProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      renderHook(() => useTheme());
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleSpy.mockRestore();
  });

  it('should return context value when used within ThemeProvider', () => {
    const mockContextValue = {
      theme: 'dark' as const,
      toggleTheme: vi.fn(),
      setTheme: vi.fn(),
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeContext.Provider value={mockContextValue}>
        {children}
      </ThemeContext.Provider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('dark');
    expect(result.current.toggleTheme).toBe(mockContextValue.toggleTheme);
  });
});
