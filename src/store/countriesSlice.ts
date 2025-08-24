import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: string[] = [
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

const countriesSlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    setCountries: (_state, action: PayloadAction<string[]>) => {
      return action.payload;
    },
  },
});

export const { setCountries } = countriesSlice.actions;
export default countriesSlice.reducer;
