import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { SelectedItemsFlyout } from './SelectedItemsFlyout';
import selectedItemsReducer, { toggleItem } from '../store/selectedItemsSlice';
import { SelectedItem } from '../types/selectedItems';

const createTestStore = (initialItems: SelectedItem[] = []) => {
  return configureStore({
    reducer: { selectedItems: selectedItemsReducer },
    preloadedState: { selectedItems: { items: initialItems } },
  });
};

const renderWithStore = (store: ReturnType<typeof createTestStore>) => {
  return render(
    <Provider store={store}>
      <SelectedItemsFlyout />
    </Provider>
  );
};

const mockSelectedItems: SelectedItem[] = [
  {
    id: 'book-1',
    title: 'Test Book 1',
    authors: ['Author 1', 'Author 2'],
    description: 'Test description 1',
    publishedDate: '2020',
    pageCount: 200,
    categories: ['Fiction', 'Adventure'],
    thumbnail: 'http://example.com/cover1.jpg',
    previewLink: 'http://example.com/preview1',
  },
  {
    id: 'book-2',
    title: 'Test Book 2',
    authors: ['Author 3'],
    description: 'Test description 2',
    publishedDate: '2021',
    categories: ['Non-fiction'],
    thumbnail: 'http://example.com/cover2.jpg',
    previewLink: 'http://example.com/preview2',
  },
  {
    id: 'book-3',
    title: 'Book with "quotes" and, commas',
    authors: ['Author "Quoted"'],
    description: 'Description with "quotes" and, commas',
    publishedDate: '2022',
    categories: ['Fiction, Drama'],
    previewLink: 'http://example.com/preview3',
  },
];

const originalCreateElement = document.createElement.bind(document);

describe('SelectedItemsFlyout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  describe('Visibility', () => {
    it('should not render when no items are selected', () => {
      const store = createTestStore([]);
      const { container } = renderWithStore(store);
      expect(container.firstChild).toBeNull();
    });

    it('should render when items are selected', () => {
      const store = createTestStore([mockSelectedItems[0]]);
      renderWithStore(store);
      expect(
        screen.getByText((_c, el) => el?.textContent === '1 item selected')
      ).toBeInTheDocument();
      expect(screen.getByText('Unselect all')).toBeInTheDocument();
      expect(screen.getByText('Download')).toBeInTheDocument();
    });
  });

  describe('Selected items count display', () => {
    it('should display singular form for 1 item', () => {
      const store = createTestStore([mockSelectedItems[0]]);
      renderWithStore(store);
      expect(
        screen.getByText((_c, el) => el?.textContent === '1 item selected')
      ).toBeInTheDocument();
    });

    it('should display plural form for multiple items', () => {
      const store = createTestStore(mockSelectedItems.slice(0, 2));
      renderWithStore(store);
      expect(
        screen.getByText((_c, el) => el?.textContent === '2 items selected')
      ).toBeInTheDocument();
    });

    it('should display correct count for larger numbers', () => {
      const store = createTestStore(mockSelectedItems);
      renderWithStore(store);
      expect(
        screen.getByText((_c, el) => el?.textContent === '3 items selected')
      ).toBeInTheDocument();
    });
  });

  describe('Unselect all functionality', () => {
    it('should clear all selected items when unselect all is clicked', () => {
      const store = createTestStore(mockSelectedItems.slice(0, 2));
      renderWithStore(store);
      fireEvent.click(screen.getByText('Unselect all'));
      expect(screen.queryByText('Unselect all')).not.toBeInTheDocument();
    });

    it('should dispatch clearAllItems action when unselect all is clicked', () => {
      const store = createTestStore([mockSelectedItems[0]]);
      const dispatchSpy = vi.spyOn(store, 'dispatch');
      renderWithStore(store);
      fireEvent.click(screen.getByText('Unselect all'));
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: 'selectedItems/clearAllItems',
      });
    });
  });

  describe('Download functionality', () => {
    it('should trigger download when download button is clicked', () => {
      const store = createTestStore([mockSelectedItems[0]]);
      renderWithStore(store);

      const mockClick = vi.fn();
      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'a')
          return {
            href: '',
            setAttribute: vi.fn(),
            click: mockClick,
          } as unknown as HTMLAnchorElement;
        return originalCreateElement(tag);
      });
      vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
      vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);

      fireEvent.click(screen.getByText('Download'));
      expect(mockClick).toHaveBeenCalled();
    });

    it('should set correct filename for single item', () => {
      const store = createTestStore([mockSelectedItems[0]]);
      renderWithStore(store);

      const mockSetAttribute = vi.fn();
      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'a')
          return {
            href: '',
            setAttribute: mockSetAttribute,
            click: vi.fn(),
          } as unknown as HTMLAnchorElement;
        return originalCreateElement(tag);
      });
      vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
      vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);

      fireEvent.click(screen.getByText('Download'));
      expect(mockSetAttribute).toHaveBeenCalledWith('download', '1_items.csv');
    });

    it('should set correct filename for multiple items', () => {
      const store = createTestStore(mockSelectedItems);
      renderWithStore(store);

      const mockSetAttribute = vi.fn();
      vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
        if (tag === 'a')
          return {
            href: '',
            setAttribute: mockSetAttribute,
            click: vi.fn(),
          } as unknown as HTMLAnchorElement;
        return originalCreateElement(tag);
      });
      vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
      vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);

      fireEvent.click(screen.getByText('Download'));
      expect(mockSetAttribute).toHaveBeenCalledWith('download', '3_items.csv');
    });
  });

  describe('Dynamic behavior', () => {
    it('should update count when items are added', async () => {
      const store = createTestStore([mockSelectedItems[0]]);
      const { rerender } = renderWithStore(store);
      expect(
        screen.getByText((_c, el) => el?.textContent === '1 item selected')
      ).toBeInTheDocument();
      store.dispatch(toggleItem(mockSelectedItems[1]));
      rerender(
        <Provider store={store}>
          <SelectedItemsFlyout />
        </Provider>
      );
      await waitFor(() => {
        expect(
          screen.getByText((_c, el) => el?.textContent === '2 items selected')
        ).toBeInTheDocument();
      });
    });

    it('should disappear when last item is removed', async () => {
      const store = createTestStore([mockSelectedItems[0]]);
      const { rerender } = renderWithStore(store);
      store.dispatch(toggleItem(mockSelectedItems[0]));
      rerender(
        <Provider store={store}>
          <SelectedItemsFlyout />
        </Provider>
      );
      await waitFor(() => {
        expect(
          screen.queryByText((_c, el) => el?.textContent === '1 item selected')
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper button elements', () => {
      const store = createTestStore([mockSelectedItems[0]]);
      renderWithStore(store);
      expect(
        screen.getByRole('button', { name: 'Unselect all' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: 'Download' })
      ).toBeInTheDocument();
    });

    it('should have proper CSS classes for styling', () => {
      const store = createTestStore([mockSelectedItems[0]]);
      renderWithStore(store);
      expect(
        screen
          .getByText((_c, el) => el?.textContent === '1 item selected')
          .closest('.selected-items-flyout')
      ).toBeInTheDocument();
      expect(screen.getByText('Unselect all')).toHaveClass('unselect-btn');
      expect(screen.getByText('Download')).toHaveClass('download-btn');
    });
  });
});
