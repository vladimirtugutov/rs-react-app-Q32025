import { describe, it, expect } from 'vitest';
import {
  selectFormData,
  selectHighlightedId,
  selectCountries,
  selectFormDataById,
  selectFormDataCount,
  selectHasHighlightedEntry,
  selectCountryByIndex,
} from './selectors';
import type { RootState } from './store';

describe('selectors', () => {
  const mockState: RootState = {
    form: {
      formData: [
        {
          id: '1',
          name: 'John',
          age: 25,
          email: 'john@test.com',
          password: 'pass',
          gender: 'male',
          termsAccepted: true,
          imageBase64: 'test',
          country: 'USA',
        },
        {
          id: '2',
          name: 'Jane',
          age: 30,
          email: 'jane@test.com',
          password: 'pass',
          gender: 'female',
          termsAccepted: true,
          imageBase64: 'test',
          country: 'UK',
        },
      ],
      highlightedId: '1',
    },
    countries: ['USA', 'UK', 'Germany'],
  };

  it('should select form data', () => {
    expect(selectFormData(mockState)).toHaveLength(2);
    expect(selectFormData(mockState)[0].name).toBe('John');
  });

  it('should select highlighted ID', () => {
    expect(selectHighlightedId(mockState)).toBe('1');
  });

  it('should select countries', () => {
    expect(selectCountries(mockState)).toEqual(['USA', 'UK', 'Germany']);
  });

  it('should select form data by ID', () => {
    expect(selectFormDataById(mockState, '1')?.name).toBe('John');
  });

  it('should return undefined for non-existent ID', () => {
    expect(selectFormDataById(mockState, '999')).toBeUndefined();
  });

  it('should select form data count', () => {
    expect(selectFormDataCount(mockState)).toBe(2);
  });

  it('should select has highlighted entry when highlightedId is set', () => {
    expect(selectHasHighlightedEntry(mockState)).toBe(true);
  });

  it('should select has highlighted entry as false when null', () => {
    const stateNoHighlight: RootState = {
      ...mockState,
      form: { ...mockState.form, highlightedId: null },
    };
    expect(selectHasHighlightedEntry(stateNoHighlight)).toBe(false);
  });

  it('should select country by index', () => {
    expect(selectCountryByIndex(mockState, 0)).toBe('USA');
    expect(selectCountryByIndex(mockState, 2)).toBe('Germany');
  });
});
