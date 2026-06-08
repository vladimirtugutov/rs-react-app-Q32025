import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormSubmission } from '../utils/formSchema';

type FormState = {
  formData: FormSubmission[];
  highlightedId: string | null;
};

const initialState: FormState = {
  formData: [],
  highlightedId: null,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addFormData: (state, action: PayloadAction<FormSubmission>) => {
      state.formData.push(action.payload);
      state.highlightedId = action.payload.id;
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

export type { FormState };
export const { addFormData, clearHighlight, clearFormData } = formSlice.actions;
export default formSlice.reducer;
