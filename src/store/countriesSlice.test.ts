import { describe, it, expect } from 'vitest';
import countriesReducer, { setCountries } from './countriesSlice';

describe('countriesSlice', () => {
  const initialState = [
    'United States',
    'Canada',
    'Germany',
    'France',
    'United Kingdom',
    'Italy',
    'Spain',
    'Australia',
    'Brazil',
    'China',
    'India',
    'Japan',
  ];

  describe('reducers', () => {
    it('should return the initial state', () => {
      expect(countriesReducer(undefined, { type: 'unknown' })).toEqual(
        initialState
      );
    });

    it('should handle setCountries', () => {
      const newCountries = ['USA', 'UK', 'Germany'];
      const action = setCountries(newCountries);
      const result = countriesReducer(initialState, action);

      expect(result).toEqual(newCountries);
    });

    it('should handle empty countries array', () => {
      const action = setCountries([]);
      const result = countriesReducer(initialState, action);

      expect(result).toEqual([]);
    });

    it('should replace existing countries completely', () => {
      const newCountries = ['Norway', 'Sweden', 'Denmark'];
      const action = setCountries(newCountries);
      const result = countriesReducer(initialState, action);

      expect(result).toEqual(newCountries);
      expect(result).not.toContain('United States');
    });

    it('should handle single country', () => {
      const action = setCountries(['Finland']);
      const result = countriesReducer(initialState, action);

      expect(result).toEqual(['Finland']);
      expect(result).toHaveLength(1);
    });
  });

  describe('action creators', () => {
    it('should create setCountries action', () => {
      const countries = ['Test Country 1', 'Test Country 2'];
      const action = setCountries(countries);

      expect(action.type).toBe('countries/setCountries');
      expect(action.payload).toEqual(countries);
    });

    it('should create setCountries action with empty array', () => {
      const action = setCountries([]);

      expect(action.type).toBe('countries/setCountries');
      expect(action.payload).toEqual([]);
    });
  });
});
