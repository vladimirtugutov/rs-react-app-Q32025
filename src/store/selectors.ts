import { RootState } from './store';

export const selectFormData = (state: RootState) => state.form.formData;
export const selectHighlightedId = (state: RootState) =>
  state.form.highlightedId;
export const selectFormDataById = (state: RootState, id: string) =>
  state.form.formData.find((entry) => entry.id === id);

export const selectCountries = (state: RootState) => state.countries;
export const selectCountryByIndex = (state: RootState, index: number) =>
  state.countries[index];

export const selectFormDataCount = (state: RootState) =>
  state.form.formData.length;
export const selectHasHighlightedEntry = (state: RootState) =>
  state.form.highlightedId !== null;
