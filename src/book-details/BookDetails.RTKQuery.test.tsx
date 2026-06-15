import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BookDetails } from './BookDetails';
import { booksApi } from '../store/api/booksApi';

vi.mock('../hooks/useBookDetails', () => ({
  useBookDetails: vi.fn(),
}));

const mockNavigate = vi.fn();
const mockUseParams = vi.fn();
const mockUseOutletContext = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
    useOutletContext: () => mockUseOutletContext(),
  };
});

const createTestStore = () => {
  return configureStore({
    reducer: {
      [booksApi.reducerPath]: booksApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(booksApi.middleware),
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <MemoryRouter>{component}</MemoryRouter>
    </Provider>
  );
};

describe('BookDetails - RTK Query Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseParams.mockReturnValue({
      detailsId: 'OL123456W',
      page: '1',
    });

    mockUseOutletContext.mockReturnValue({
      results: [
        {
          key: '/works/OL123456W',
          title: 'Test Book',
          author_name: ['Test Author'],
          first_publish_year: 2020,
          cover_i: 123456,
          publisher: ['Test Publisher'],
          subject: ['Fiction'],
        },
      ],
    });
  });

  it('should show loading in BookDetails RTK Query', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: null,
      isLoading: true,
      error: null,
    });

    renderWithProviders(<BookDetails />);

    expect(screen.getByTestId('loading-section')).toBeInTheDocument();
    expect(
      screen.getByText('Loading detailed information...')
    ).toBeInTheDocument();
  });

  it('should handle RTK Query error in BookDetails', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: null,
      isLoading: false,
      error: 'Failed to fetch book details: 404',
    });

    renderWithProviders(<BookDetails />);

    expect(
      screen.getByText(
        /Error loading additional details: Failed to fetch book details: 404/
      )
    ).toBeInTheDocument();
  });

  it('should handle cached book details data', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: {
        title: 'Cached Book Details',
        description: 'Cached description from RTK Query cache',
        number_of_pages: 250,
      },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<BookDetails />);

    expect(
      screen.getByText('Cached description from RTK Query cache')
    ).toBeInTheDocument();
    expect(screen.getByText('250')).toBeInTheDocument();
  });
});
