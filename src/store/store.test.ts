import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { store } from './store';
import formReducer, { addFormData } from './formSlice';
import countriesReducer, { setCountries } from './countriesSlice';
import type { RootState } from './store';

describe('store configuration', () => {
  it('should have the correct initial state', () => {
    const state = store.getState();

    expect(state.form).toEqual({
      formData: [],
      highlightedId: null,
    });

    expect(state.countries).toContain('United States');
    expect(state.countries).toContain('Canada');
    expect(state.countries).toHaveLength(12);
  });

  it('should handle form actions', () => {
    const testStore = configureStore({
      reducer: {
        form: formReducer,
        countries: countriesReducer,
      },
    });

    const mockFormData = {
      id: 'test',
      name: 'John',
      age: 25,
      email: 'john@test.com',
      password: 'pass',
      gender: 'male' as const,
      termsAccepted: true,
      imageBase64: 'test',
      country: 'USA',
    };

    testStore.dispatch(addFormData(mockFormData));
    const state = testStore.getState();

    expect(state.form.formData).toHaveLength(1);
    expect(state.form.formData[0].name).toBe('John');
  });

  it('should handle countries actions', () => {
    const testStore = configureStore({
      reducer: {
        form: formReducer,
        countries: countriesReducer,
      },
    });

    const newCountries = ['Test1', 'Test2'];
    testStore.dispatch(setCountries(newCountries));
    const state = testStore.getState();

    expect(state.countries).toEqual(newCountries);
  });

  it('should have correct TypeScript types', () => {
    const state: RootState = store.getState();

    expect(typeof state.form.formData).toBe('object');
    expect(Array.isArray(state.form.formData)).toBe(true);
    expect(typeof state.countries).toBe('object');
    expect(Array.isArray(state.countries)).toBe(true);
  });
});
