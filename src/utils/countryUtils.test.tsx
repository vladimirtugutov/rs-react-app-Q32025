import { describe, it, expect } from 'vitest';
import { filterCountries } from './countryUtils';

describe('countryUtils', () => {
  describe('filterCountries', () => {
    const mockCountries = [
      'United States',
      'Canada',
      'France',
      'Germany',
      'Brazil',
      'Australia',
      'Japan',
      'United Kingdom',
      'Italy',
      'Spain',
      'Mexico',
      'Argentina',
      'South Africa',
      'Finland',
      'Iceland',
    ];

    it('should return empty array when query is empty', () => {
      expect(filterCountries(mockCountries, '')).toEqual([]);
      expect(filterCountries(mockCountries, '  ')).toEqual([]);
    });

    it('should filter countries by partial name match', () => {
      const result = filterCountries(mockCountries, 'Unit');
      expect(result).toEqual(['United States', 'United Kingdom']);
    });

    it('should be case insensitive', () => {
      const result = filterCountries(mockCountries, 'unit');
      expect(result).toEqual(['United States', 'United Kingdom']);

      const result2 = filterCountries(mockCountries, 'CANADA');
      expect(result2).toEqual(['Canada']);
    });

    it('should filter by substring anywhere in name', () => {
      const result = filterCountries(mockCountries, 'land');
      expect(result).toEqual(['Finland', 'Iceland']);
    });

    it('should return single match when only one country matches', () => {
      const result = filterCountries(mockCountries, 'Japan');
      expect(result).toEqual(['Japan']);
    });

    it('should return empty array when no countries match', () => {
      const result = filterCountries(mockCountries, 'xyz');
      expect(result).toEqual([]);
    });

    it('should limit results to maximum 10 countries', () => {
      const manyCountries = Array.from({ length: 15 }, (_, i) => `Country${i}`);
      const result = filterCountries(manyCountries, 'Country');
      expect(result).toHaveLength(10);
    });

    it('should return countries in original order', () => {
      const result = filterCountries(mockCountries, 'a');
      const expected = mockCountries
        .filter((country) => country.toLowerCase().includes('a'))
        .slice(0, 10);
      expect(result).toEqual(expected);
    });

    it('should handle empty countries array', () => {
      const result = filterCountries([], 'test');
      expect(result).toEqual([]);
    });

    it('should handle special characters in query', () => {
      const countriesWithSpecial = ['São Paulo', 'México', 'España'];
      const result = filterCountries(countriesWithSpecial, 'ão');
      expect(result).toEqual(['São Paulo']);
    });

    it('should match partial words', () => {
      const result = filterCountries(mockCountries, 'Stat');
      expect(result).toEqual(['United States']);
    });
  });
});
