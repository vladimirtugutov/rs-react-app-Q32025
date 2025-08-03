import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SelectedItem, SelectedItemsState } from '../types/selectedItems';

const initialState: SelectedItemsState = {
  items: [],
};

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleItem: (state, action: PayloadAction<SelectedItem>) => {
      const existingIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    clearAllItems: (state) => {
      state.items = [];
    },
  },
});

export const { toggleItem, clearAllItems } = selectedItemsSlice.actions;
export default selectedItemsSlice.reducer;

export const selectSelectedItems = (state: {
  selectedItems: SelectedItemsState;
}) => state.selectedItems.items;

export const selectSelectedItemsCount = (state: {
  selectedItems: SelectedItemsState;
}) => state.selectedItems.items.length;

export const selectIsItemSelected =
  (itemId: string) => (state: { selectedItems: SelectedItemsState }) =>
    state.selectedItems.items.some((item) => item.id === itemId);
