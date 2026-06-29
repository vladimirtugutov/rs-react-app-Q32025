import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { store, RootState, AppDispatch } from './index';
import selectedItemsReducer from './selectedItemsSlice';
import { toggleItem, clearAllItems } from './selectedItemsSlice';
import { SelectedItem } from '../types/selectedItems';

describe('Redux Store Configuration', () => {
  beforeEach(() => {
    store.dispatch(clearAllItems());
  });

  describe('Exported store configuration', () => {
    it('should export a properly configured store', () => {
      expect(store).toBeDefined();
      expect(typeof store.dispatch).toBe('function');
      expect(typeof store.getState).toBe('function');
      expect(typeof store.subscribe).toBe('function');
    });

    it('should have correct initial state structure', () => {
      const state = store.getState();

      expect(state).toHaveProperty('selectedItems');
      expect(state.selectedItems).toHaveProperty('items');
      expect(Array.isArray(state.selectedItems.items)).toBe(true);
    });

    it('should handle dispatching actions to exported store', () => {
      const mockItem: SelectedItem = {
        id: 'exported-store-test-1',
        title: 'Test Book',
        authors: ['Test Author'],
      };

      const initialState = store.getState();
      const initialCount = initialState.selectedItems.items.length;

      store.dispatch(toggleItem(mockItem));

      const newState = store.getState();
      expect(newState.selectedItems.items).toHaveLength(initialCount + 1);

      store.dispatch(toggleItem(mockItem));
    });
  });

  describe('Type exports', () => {
    it('should export correct RootState type', () => {
      const state: RootState = store.getState();

      expect(state).toHaveProperty('selectedItems');
      expect(state.selectedItems).toHaveProperty('items');

      const items = state.selectedItems.items;
      expect(Array.isArray(items)).toBe(true);
    });

    it('should export correct AppDispatch type', () => {
      const dispatch: AppDispatch = store.dispatch;

      const mockItem: SelectedItem = {
        id: 'type-test-1',
        title: 'Type Test Book',
      };

      expect(() => {
        dispatch(toggleItem(mockItem));
        dispatch(clearAllItems());
      }).not.toThrow();
    });

    it('should infer correct types from store methods', () => {
      const getState = store.getState;
      const dispatch = store.dispatch;

      expect(typeof getState).toBe('function');
      expect(typeof dispatch).toBe('function');

      const state = getState();
      expect(state.selectedItems).toBeDefined();

      dispatch(clearAllItems());
      expect(getState().selectedItems.items).toHaveLength(0);
    });
  });

  describe('Store configuration validation', () => {
    it('should have selectedItems reducer configured in exported store', () => {
      const state = store.getState();
      expect(state.selectedItems).toBeDefined();
      expect(state.selectedItems.items).toBeDefined();
    });

    it('should maintain state consistency in exported store', () => {
      const mockItems: SelectedItem[] = [
        { id: 'consistency-1', title: 'Book 1' },
        { id: 'consistency-2', title: 'Book 2' },
      ];

      mockItems.forEach((item) => {
        store.dispatch(toggleItem(item));
      });

      const state = store.getState();
      expect(state.selectedItems.items).toHaveLength(2);

      store.dispatch(clearAllItems());
    });
  });

  describe('Store subscription functionality', () => {
    it('should allow subscribing to the exported store', () => {
      let notificationCount = 0;

      const unsubscribe = store.subscribe(() => {
        notificationCount++;
      });

      const mockItem: SelectedItem = {
        id: 'subscription-test-1',
        title: 'Subscription Test',
      };

      store.dispatch(toggleItem(mockItem));
      expect(notificationCount).toBe(1);

      store.dispatch(clearAllItems());
      expect(notificationCount).toBe(2);

      unsubscribe();
    });
  });

  describe('Store isolation (for testing purposes)', () => {
    it('should create independent store instances', () => {
      const testStore = configureStore({
        reducer: {
          selectedItems: selectedItemsReducer,
        },
      });

      const mockItem: SelectedItem = {
        id: 'isolation-test-1',
        title: 'Test Book',
      };

      store.dispatch(toggleItem(mockItem));

      expect(store.getState().selectedItems.items).toHaveLength(1);
      expect(testStore.getState().selectedItems.items).toHaveLength(0);

      store.dispatch(clearAllItems());
    });
  });
});
