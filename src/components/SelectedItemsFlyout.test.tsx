import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import { SelectedItemsFlyout } from './SelectedItemsFlyout';
import selectedItemsReducer, { toggleItem } from '../store/selectedItemsSlice';
import { SelectedItem } from '../types/selectedItems';

const mockSaveAs = vi.hoisted(() => vi.fn());

vi.mock('file-saver', () => ({
  saveAs: mockSaveAs,
}));

class MockBlob {
  content: string;
  type: string;

  constructor(content: string[], options: { type?: string } = {}) {
    this.content = content.join('');
    this.type = options.type || '';
  }

  text() {
    return Promise.resolve(this.content);
  }
}

Object.defineProperty(globalThis, 'Blob', {
  value: MockBlob,
  configurable: true,
});

const createTestStore = (initialItems: SelectedItem[] = []) => {
  const store = configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
    preloadedState: {
      selectedItems: {
        items: initialItems,
      },
    },
  });
  return store;
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

describe('SelectedItemsFlyout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
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
        screen.getByText((_content, element) => {
          return element?.textContent === '1 item selected';
        })
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
        screen.getByText((_content, element) => {
          return element?.textContent === '1 item selected';
        })
      ).toBeInTheDocument();
    });

    it('should display plural form for multiple items', () => {
      const store = createTestStore(mockSelectedItems.slice(0, 2));
      renderWithStore(store);

      expect(
        screen.getByText((_content, element) => {
          return element?.textContent === '2 items selected';
        })
      ).toBeInTheDocument();
    });

    it('should display correct count for larger numbers', () => {
      const store = createTestStore(mockSelectedItems);
      renderWithStore(store);

      expect(
        screen.getByText((_content, element) => {
          return element?.textContent === '3 items selected';
        })
      ).toBeInTheDocument();
    });
  });

  describe('Unselect all functionality', () => {
    it('should clear all selected items when unselect all is clicked', () => {
      const store = createTestStore(mockSelectedItems.slice(0, 2));
      renderWithStore(store);

      const unselectButton = screen.getByText('Unselect all');
      fireEvent.click(unselectButton);

      expect(screen.queryByText('Unselect all')).not.toBeInTheDocument();
    });

    it('should dispatch clearAllItems action when unselect all is clicked', () => {
      const store = createTestStore([mockSelectedItems[0]]);
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      renderWithStore(store);

      const unselectButton = screen.getByText('Unselect all');
      fireEvent.click(unselectButton);

      expect(dispatchSpy).toHaveBeenCalledWith({
        type: 'selectedItems/clearAllItems',
      });
    });
  });

  describe('Download functionality', () => {
    it('should call saveAs when download button is clicked', () => {
      const store = createTestStore([mockSelectedItems[0]]);

      renderWithStore(store);

      const downloadButton = screen.getByText('Download');
      fireEvent.click(downloadButton);

      expect(mockSaveAs).toHaveBeenCalledWith(
        expect.any(MockBlob),
        '1_items.csv'
      );
    });

    it('should generate correct filename for multiple items', () => {
      const store = createTestStore(mockSelectedItems);

      renderWithStore(store);

      const downloadButton = screen.getByText('Download');
      fireEvent.click(downloadButton);

      expect(mockSaveAs).toHaveBeenCalledWith(
        expect.any(MockBlob),
        '3_items.csv'
      );
    });

    it('should create blob with correct content type', () => {
      const store = createTestStore([mockSelectedItems[0]]);

      renderWithStore(store);

      const downloadButton = screen.getByText('Download');
      fireEvent.click(downloadButton);

      const mockCalls = mockSaveAs.mock.calls;
      const firstCall = mockCalls[0];
      const blob = firstCall[0] as MockBlob;

      expect(blob).toBeInstanceOf(MockBlob);
      expect(blob.type).toBe('text/csv;charset=utf-8;');
    });
  });

  describe('CSV generation', () => {
    it('should generate correct CSV headers', async () => {
      const store = createTestStore([mockSelectedItems[0]]);

      renderWithStore(store);

      const downloadButton = screen.getByText('Download');
      fireEvent.click(downloadButton);

      const mockCalls = mockSaveAs.mock.calls;
      const firstCall = mockCalls[0];
      const blob = firstCall[0] as MockBlob;
      const csvContent = await blob.text();

      const expectedHeaders =
        'Title,Authors,Description,Published Date,Page Count,Categories,Preview Link';
      expect(csvContent).toContain(expectedHeaders);
    });

    it('should generate correct CSV content for single item', async () => {
      const store = createTestStore([mockSelectedItems[0]]);

      renderWithStore(store);

      const downloadButton = screen.getByText('Download');
      fireEvent.click(downloadButton);

      const mockCalls = mockSaveAs.mock.calls;
      const firstCall = mockCalls[0];
      const blob = firstCall[0] as MockBlob;
      const csvContent = await blob.text();

      expect(csvContent).toContain('"Test Book 1"');
      expect(csvContent).toContain('"Author 1; Author 2"');
      expect(csvContent).toContain('"Test description 1"');
      expect(csvContent).toContain('"2020"');
      expect(csvContent).toContain('"200"');
      expect(csvContent).toContain('"Fiction; Adventure"');
      expect(csvContent).toContain('"http://example.com/preview1"');
    });

    it('should properly escape quotes in CSV content', async () => {
      const store = createTestStore([mockSelectedItems[2]]);

      renderWithStore(store);

      const downloadButton = screen.getByText('Download');
      fireEvent.click(downloadButton);

      const mockCalls = mockSaveAs.mock.calls;
      const firstCall = mockCalls[0];
      const blob = firstCall[0] as MockBlob;
      const csvContent = await blob.text();

      expect(csvContent).toContain('""quotes""');
      expect(csvContent).toContain('"Author ""Quoted"""');
    });

    it('should handle empty/undefined fields correctly', async () => {
      const itemWithEmptyFields: SelectedItem = {
        id: 'empty-book',
        title: 'Empty Book',
      };

      const store = createTestStore([itemWithEmptyFields]);

      renderWithStore(store);

      const downloadButton = screen.getByText('Download');
      fireEvent.click(downloadButton);

      const mockCalls = mockSaveAs.mock.calls;
      const firstCall = mockCalls[0];
      const blob = firstCall[0] as MockBlob;
      const csvContent = await blob.text();

      expect(csvContent).toContain('"Empty Book"');
      expect(csvContent).toContain('""');
    });

    it('should generate correct CSV for multiple items', async () => {
      const store = createTestStore(mockSelectedItems.slice(0, 2));

      renderWithStore(store);

      const downloadButton = screen.getByText('Download');
      fireEvent.click(downloadButton);

      const mockCalls = mockSaveAs.mock.calls;
      const firstCall = mockCalls[0];
      const blob = firstCall[0] as MockBlob;
      const csvContent = await blob.text();

      const lines = csvContent.split('\n');
      expect(lines).toHaveLength(3);
      expect(lines[0]).toContain('Title,Authors');
      expect(lines[1]).toContain('Test Book 1');
      expect(lines[2]).toContain('Test Book 2');
    });
  });

  describe('Error handling', () => {
    it('should handle download errors gracefully', () => {
      mockSaveAs.mockImplementation(() => {
        throw new Error('Save failed');
      });

      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const store = createTestStore([mockSelectedItems[0]]);

      renderWithStore(store);

      const downloadButton = screen.getByText('Download');
      fireEvent.click(downloadButton);

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error downloading CSV:',
        expect.any(Error)
      );
    });
  });

  describe('Dynamic behavior', () => {
    it('should update count when items are added', async () => {
      const store = createTestStore([mockSelectedItems[0]]);
      const { rerender } = renderWithStore(store);

      expect(
        screen.getByText((_content, element) => {
          return element?.textContent === '1 item selected';
        })
      ).toBeInTheDocument();

      store.dispatch(toggleItem(mockSelectedItems[1]));

      rerender(
        <Provider store={store}>
          <SelectedItemsFlyout />
        </Provider>
      );

      await waitFor(() => {
        expect(
          screen.getByText((_content, element) => {
            return element?.textContent === '2 items selected';
          })
        ).toBeInTheDocument();
      });
    });

    it('should disappear when last item is removed', async () => {
      const store = createTestStore([mockSelectedItems[0]]);
      const { rerender } = renderWithStore(store);

      expect(
        screen.getByText((_content, element) => {
          return element?.textContent === '1 item selected';
        })
      ).toBeInTheDocument();

      store.dispatch(toggleItem(mockSelectedItems[0]));

      rerender(
        <Provider store={store}>
          <SelectedItemsFlyout />
        </Provider>
      );

      await waitFor(() => {
        expect(
          screen.queryByText((_content, element) => {
            return element?.textContent === '1 item selected';
          })
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper button elements', () => {
      const store = createTestStore([mockSelectedItems[0]]);
      renderWithStore(store);

      const unselectButton = screen.getByRole('button', {
        name: 'Unselect all',
      });
      const downloadButton = screen.getByRole('button', { name: 'Download' });

      expect(unselectButton).toBeInTheDocument();
      expect(downloadButton).toBeInTheDocument();
    });

    it('should have proper CSS classes for styling', () => {
      const store = createTestStore([mockSelectedItems[0]]);
      renderWithStore(store);

      expect(
        screen
          .getByText((_content, element) => {
            return element?.textContent === '1 item selected';
          })
          .closest('.selected-items-flyout')
      ).toBeInTheDocument();
      expect(screen.getByText('Unselect all')).toHaveClass('unselect-btn');
      expect(screen.getByText('Download')).toHaveClass('download-btn');
    });
  });
});
