import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { BookItem } from './BookItem';
import selectedItemsReducer from '../store/selectedItemsSlice';
import { Book } from '../types/book';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ page: '2' }),
  };
});

const mockBook: Book = {
  key: '/works/OL12345W',
  title: 'Words of Radiance',
  author_name: ['Brandon Sanderson'],
  first_publish_year: 2014,
  cover_i: 12345,
  subject: ['Fantasy', 'Epic'],
};

const createTestStore = () =>
  configureStore({
    reducer: { selectedItems: selectedItemsReducer },
  });

describe('BookItem Component', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
    vi.clearAllMocks();
  });

  it('should render main book info and cover correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BookItem
            book={mockBook}
            isSelected={false}
            isDetailSelected={false}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Words of Radiance')).toBeInTheDocument();
    expect(screen.getByText('by Brandon Sanderson')).toBeInTheDocument();
    const img = screen.getByRole('img', { name: /Words of Radiance/i });
    expect(img).toHaveAttribute(
      'src',
      'https://covers.openlibrary.org/b/id/12345-M.jpg'
    );
  });

  it('should navigate to details page on card click', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BookItem
            book={mockBook}
            isSelected={false}
            isDetailSelected={false}
          />
        </MemoryRouter>
      </Provider>
    );

    const card = screen.getByText('Words of Radiance').closest('.result-card');
    if (card) fireEvent.click(card);

    expect(mockNavigate).toHaveBeenCalledWith('/2/OL12345W');
  });

  it('should dispatch toggleItem on checkbox change and stop propagation', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BookItem
            book={mockBook}
            isSelected={false}
            isDetailSelected={false}
          />
        </MemoryRouter>
      </Provider>
    );

    const checkbox = screen.getByRole('checkbox', {
      name: /Select Words of Radiance/i,
    });
    fireEvent.click(checkbox);

    expect(dispatchSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'selectedItems/toggleItem',
        payload: expect.objectContaining({
          id: 'OL12345W',
          title: 'Words of Radiance',
          authors: ['Brandon Sanderson'],
          publishedDate: '2014',
        }),
      })
    );

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('should hide image on error event', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <BookItem
            book={mockBook}
            isSelected={false}
            isDetailSelected={false}
          />
        </MemoryRouter>
      </Provider>
    );

    const img = screen.getByRole('img', { name: /Words of Radiance/i });
    fireEvent.error(img);

    expect(img).toHaveStyle({ display: 'none' });
  });

  it('should fallback to undefined cover and default description if not provided', () => {
    const minimalBook: Book = {
      key: '/works/OL00000W',
      title: 'Minimal Book',
    };

    render(
      <Provider store={store}>
        <MemoryRouter>
          <BookItem
            book={minimalBook}
            isSelected={false}
            isDetailSelected={false}
          />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByRole('img')).not.toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(store.getState().selectedItems.items[0].description).toBe(
      'No description available'
    );
  });
});
