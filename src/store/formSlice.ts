import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormData {
  id: string;
  name: string;
  age: number;
  email: string;
  password: string;
  gender: string;
  termsAccepted: boolean;
  imageBase64?: string;
  country: string;
}

interface FormState {
  formData: FormData[];
  highlightedId: string | null;
}

const initialState: FormState = {
  formData: [],
  highlightedId: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addFormData: (state, action: PayloadAction<FormData>) => {
      const newEntry = { ...action.payload, id: Date.now().toString() };
      state.formData.push(newEntry);
      state.highlightedId = newEntry.id;
    },
    clearHighlight: (state) => {
      state.highlightedId = null;
    },
    clearFormData: (state) => {
      state.formData = [];
      state.highlightedId = null;
    },
  },
});

export const { addFormData, clearHighlight, clearFormData } = formSlice.actions;
export default formSlice.reducer;
