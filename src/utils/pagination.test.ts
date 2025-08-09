import { describe, it, expect } from 'vitest';
import { getVisiblePages } from './pagination';

describe('getVisiblePages', () => {
  describe('Edge cases', () => {
    it('should return empty array when totalPages is 0', () => {
      expect(getVisiblePages(1, 0)).toEqual([]);
    });

    it('should return [1] when totalPages is 1', () => {
      expect(getVisiblePages(1, 1)).toEqual([1]);
    });

    it('should handle 2 pages correctly', () => {
      expect(getVisiblePages(1, 2)).toEqual([1, 2]);
      expect(getVisiblePages(2, 2)).toEqual([1, 2]);
    });

    it('should handle 3 pages correctly', () => {
      expect(getVisiblePages(1, 3)).toEqual([1, 2, 3]);
      expect(getVisiblePages(2, 3)).toEqual([1, 2, 3]);
      expect(getVisiblePages(3, 3)).toEqual([1, 2, 3]);
    });
  });

  describe('Small pagination (no dots needed)', () => {
    it('should show pages with dots when current is at start', () => {
      expect(getVisiblePages(1, 5)).toEqual([1, 2, 3, '...', 5]);
      expect(getVisiblePages(2, 5)).toEqual([1, 2, 3, 4, 5]);
      expect(getVisiblePages(3, 5)).toEqual([1, 2, 3, 4, 5]);
    });

    it('should show all pages when current is in middle for small total', () => {
      expect(getVisiblePages(3, 6)).toEqual([1, 2, 3, 4, 5, 6]);
      expect(getVisiblePages(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  describe('Large pagination (with dots)', () => {
    it('should show dots after first page when current is near end', () => {
      expect(getVisiblePages(8, 10)).toEqual([1, '...', 6, 7, 8, 9, 10]);
    });

    it('should show dots before last page when current is near start', () => {
      expect(getVisiblePages(3, 10)).toEqual([1, 2, 3, 4, 5, '...', 10]);
    });

    it('should show dots on both sides when current is in middle', () => {
      expect(getVisiblePages(5, 10)).toEqual([
        1,
        '...',
        3,
        4,
        5,
        6,
        7,
        '...',
        10,
      ]);
    });

    it('should handle very large pagination', () => {
      expect(getVisiblePages(50, 100)).toEqual([
        1,
        '...',
        48,
        49,
        50,
        51,
        52,
        '...',
        100,
      ]);
    });
  });

  describe('Boundary conditions', () => {
    it('should handle first page correctly', () => {
      expect(getVisiblePages(1, 10)).toEqual([1, 2, 3, '...', 10]);
    });

    it('should handle last page correctly', () => {
      expect(getVisiblePages(10, 10)).toEqual([1, '...', 8, 9, 10]);
    });

    it('should handle second page correctly', () => {
      expect(getVisiblePages(2, 10)).toEqual([1, 2, 3, 4, '...', 10]);
    });

    it('should handle second to last page correctly', () => {
      expect(getVisiblePages(9, 10)).toEqual([1, '...', 7, 8, 9, 10]);
    });
  });

  describe('Custom delta parameter', () => {
    it('should respect custom delta = 1', () => {
      expect(getVisiblePages(5, 10, 1)).toEqual([1, '...', 4, 5, 6, '...', 10]);
    });

    it('should respect custom delta = 3', () => {
      expect(getVisiblePages(7, 15, 3)).toEqual([
        1,
        '...',
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        '...',
        15,
      ]);
    });

    it('should handle delta = 0', () => {
      expect(getVisiblePages(5, 10, 0)).toEqual([1, '...', 5, '...', 10]);
    });
  });

  describe('No dots scenarios', () => {
    it('should show dots when range does not connect to first page', () => {
      expect(getVisiblePages(4, 10)).toEqual([1, 2, 3, 4, 5, 6, '...', 10]);
    });

    it('should show dots when range does not connect to last page', () => {
      expect(getVisiblePages(7, 10)).toEqual([1, '...', 5, 6, 7, 8, 9, 10]);
    });

    it('should show continuous range when no gaps exist', () => {
      expect(getVisiblePages(4, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  describe('Invalid inputs', () => {
    it('should handle currentPage < 1 by using current logic', () => {
      expect(getVisiblePages(0, 5)).toEqual([1, 2, '...', 5]);
      expect(getVisiblePages(-1, 5)).toEqual([1, '...', 5]);
    });

    it('should handle currentPage > totalPages by using current logic', () => {
      expect(getVisiblePages(10, 5)).toEqual([1, '...', 5]);
    });

    it('should handle negative totalPages', () => {
      expect(getVisiblePages(1, -1)).toEqual([]);
    });
  });

  describe('Performance cases', () => {
    it('should handle very large page numbers efficiently', () => {
      const start = performance.now();
      const result = getVisiblePages(5000, 10000);
      const end = performance.now();

      expect(result).toEqual([
        1,
        '...',
        4998,
        4999,
        5000,
        5001,
        5002,
        '...',
        10000,
      ]);
      expect(end - start).toBeLessThan(10);
    });
  });

  describe('Function behavior analysis', () => {
    it('should handle edge case where delta creates empty range', () => {
      expect(getVisiblePages(1, 4)).toEqual([1, 2, 3, 4]);
    });

    it('should handle case where current page is exactly at delta boundary', () => {
      expect(getVisiblePages(5, 8)).toEqual([1, '...', 3, 4, 5, 6, 7, 8]);
    });

    it('should show correct pagination for middle pages', () => {
      expect(getVisiblePages(6, 12)).toEqual([
        1,
        '...',
        4,
        5,
        6,
        7,
        8,
        '...',
        12,
      ]);
    });
  });
});
