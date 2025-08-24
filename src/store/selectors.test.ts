import { describe, it, expect } from 'vitest';
import { RootState } from './store';

// Селекторы
export const selectFormData = (state: RootState) => state.form.formData;
export const selectHighlightedId = (state: RootState) =>
  state.form.highlightedId;
export const selectCountries = (state: RootState) => state.countries;
export const selectFormDataById = (state: RootState, id: string) =>
  state.form.formData.find((entry) => entry.id === id);

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
    const result = selectFormData(mockState);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('John');
  });

  it('should select highlighted ID', () => {
    const result = selectHighlightedId(mockState);
    expect(result).toBe('1');
  });

  it('should select countries', () => {
    const result = selectCountries(mockState);
    expect(result).toEqual(['USA', 'UK', 'Germany']);
  });

  it('should select form data by ID', () => {
    const result = selectFormDataById(mockState, '1');
    expect(result?.name).toBe('John');
  });

  it('should return undefined for non-existent ID', () => {
    const result = selectFormDataById(mockState, '999');
    expect(result).toBeUndefined();
  });
});
