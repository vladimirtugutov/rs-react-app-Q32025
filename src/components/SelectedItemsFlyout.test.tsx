import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { SelectedItemsFlyout } from './SelectedItemsFlyout';
import selectedItemsReducer, { toggleItem } from '../store/selectedItemsSlice';
import { SelectedItem } from '../types/selectedItems';

vi.mock('./ExportCsvForm', () => ({
  ExportCsvForm: () => (
    <button className="export-csv-button">Export CSV</button>
  ),
}));

const createTestStore = (initialItems: SelectedItem[] = []) =>
  configureStore({
    reducer: { selectedItems: selectedItemsReducer },
    preloadedState: { selectedItems: { items: initialItems } },
  });

const renderWithStore = (store: ReturnType<typeof createTestStore>) =>
  render(
    <Provider store={store}>
      <SelectedItemsFlyout />
    </Provider>
  );

const mockItems: SelectedItem[] = [
  { id: 'book-1', title: 'Test Book 1', authors: ['Author 1'] },
  { id: 'book-2', title: 'Test Book 2', authors: ['Author 2'] },
  { id: 'book-3', title: 'Test Book 3', authors: ['Author 3'] },
];

describe('SelectedItemsFlyout', () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  describe('Visibility', () => {
    it('should not render when no items are selected', () => {
      const { container } = renderWithStore(createTestStore([]));
      expect(container.firstChild).toBeNull();
    });

    it('should render when items are selected', () => {
      renderWithStore(createTestStore([mockItems[0]]));
      expect(screen.getByText(/item selected/)).toBeInTheDocument();
      expect(screen.getByText('Unselect all')).toBeInTheDocument();
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
    });
  });

  describe('Selected items count display', () => {
    it('should display singular form for 1 item', () => {
      renderWithStore(createTestStore([mockItems[0]]));
      expect(
        screen.getByText((_, el) => el?.textContent === '1 item selected')
      ).toBeInTheDocument();
    });

    it('should display plural form for 2 items', () => {
      renderWithStore(createTestStore(mockItems.slice(0, 2)));
      expect(
        screen.getByText((_, el) => el?.textContent === '2 items selected')
      ).toBeInTheDocument();
    });

    it('should display correct count for 3 items', () => {
      renderWithStore(createTestStore(mockItems));
      expect(
        screen.getByText((_, el) => el?.textContent === '3 items selected')
      ).toBeInTheDocument();
    });
  });

  describe('Unselect all', () => {
    it('should clear all items when clicked', () => {
      const store = createTestStore(mockItems.slice(0, 2));
      renderWithStore(store);

      fireEvent.click(screen.getByText('Unselect all'));

      expect(store.getState().selectedItems.items).toHaveLength(0);
    });

    it('should dispatch clearAllItems action', () => {
      const store = createTestStore([mockItems[0]]);
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      renderWithStore(store);

      fireEvent.click(screen.getByText('Unselect all'));

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: 'selectedItems/clearAllItems',
      });
    });

    it('should hide flyout after unselecting all', () => {
      const store = createTestStore([mockItems[0]]);
      const { container } = renderWithStore(store);

      fireEvent.click(screen.getByText('Unselect all'));

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Dynamic behavior', () => {
    it('should update count when item is added', async () => {
      const store = createTestStore([mockItems[0]]);
      const { rerender } = renderWithStore(store);

      store.dispatch(toggleItem(mockItems[1]));
      rerender(
        <Provider store={store}>
          <SelectedItemsFlyout />
        </Provider>
      );

      await waitFor(() => {
        expect(
          screen.getByText((_, el) => el?.textContent === '2 items selected')
        ).toBeInTheDocument();
      });
    });

    it('should disappear when last item is removed', async () => {
      const store = createTestStore([mockItems[0]]);
      const { rerender, container } = renderWithStore(store);

      store.dispatch(toggleItem(mockItems[0]));
      rerender(
        <Provider store={store}>
          <SelectedItemsFlyout />
        </Provider>
      );

      await waitFor(() => {
        expect(container.firstChild).toBeNull();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper button roles', () => {
      renderWithStore(createTestStore([mockItems[0]]));

      expect(
        screen.getByRole('button', { name: 'Unselect all' })
      ).toBeInTheDocument();
    });

    it('should have correct CSS classes', () => {
      renderWithStore(createTestStore([mockItems[0]]));

      expect(
        screen
          .getByText((_, el) => el?.textContent === '1 item selected')
          ?.closest('.selected-items-flyout')
      ).toBeInTheDocument();

      expect(screen.getByText('Unselect all')).toHaveClass('unselect-btn');
    });
  });
});
