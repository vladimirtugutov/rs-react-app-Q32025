import { describe, it, expect } from 'vitest';
import { getVisiblePages } from './getVisiblePages';

describe('getVisiblePages utility', () => {
  it('should return correct range for the first page without dots', () => {
    expect(getVisiblePages(1, 3)).toEqual([1, 2, 3]);
  });

  it('should inject dots correctly for deep pages', () => {
    const result = getVisiblePages(10, 20);
    expect(result).toContain('...');
    expect(result[0]).toBe(1);
    expect(result[result.length - 1]).toBe(20);
  });
});
