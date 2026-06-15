import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BookDetails } from './BookDetails';
import { OpenLibraryBook } from '../types/book';
import { booksApi } from '../store/api/booksApi';

vi.mock('../hooks/useBookDetails', () => ({
  useBookDetails: vi.fn(),
}));

const mockFetch = vi.fn();
globalThis.fetch = mockFetch as typeof fetch;

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

const createMockStore = () => {
  return configureStore({
    reducer: {
      [booksApi.reducerPath]: booksApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(booksApi.middleware),
  });
};

const mockBookFromList: OpenLibraryBook = {
  key: '/works/OL123456W',
  title: 'Test Book Title',
  author_name: ['Test Author', 'Second Author'],
  first_publish_year: 2020,
  cover_i: 123456,
  publisher: ['Test Publisher', 'Another Publisher'],
  subject: ['Fiction', 'Adventure', 'Mystery'],
};

const mockBookDetailsAPI = {
  title: 'Test Book Title',
  description: {
    value: 'This is a detailed description from the API about the test book.',
  },
  number_of_pages: 300,
  languages: [{ key: '/languages/eng' }, { key: '/languages/spa' }],
  isbn_10: ['1234567890', '0987654321'],
  isbn_13: ['9781234567890', '9780987654321'],
  subjects: ['Fiction', 'Adventure', 'Mystery', 'Drama'],
  publish_date: '2020-01-01',
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createMockStore();
  return render(
    <Provider store={store}>
      <MemoryRouter>{component}</MemoryRouter>
    </Provider>
  );
};

describe('BookDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockNavigate.mockClear();

    mockUseParams.mockReturnValue({
      detailsId: 'OL123456W',
      page: '1',
    });

    mockUseOutletContext.mockReturnValue({
      results: [mockBookFromList],
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return null when detailsId is not provided', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    mockUseParams.mockReturnValue({
      page: '1',
    });

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: null,
      isLoading: false,
      error: null,
    });

    const { container } = renderWithProviders(<BookDetails />);
    expect(container.firstChild).toBeNull();
  });

  it('should display book not found message when book is not in results', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    mockUseOutletContext.mockReturnValue({
      results: [],
    });

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: null,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<BookDetails />);

    expect(screen.getByTestId('book-details-panel')).toBeInTheDocument();
    expect(screen.getByTestId('book-details-title')).toBeInTheDocument();
    expect(screen.getByTestId('book-not-found')).toBeInTheDocument();
  });

  it('should render close button with correct functionality', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    mockUseOutletContext.mockReturnValue({
      results: [],
    });

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: null,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<BookDetails />);

    const closeButton = screen.getByTestId('close-button');
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute('title', 'Close details');

    fireEvent.click(closeButton);
    expect(mockNavigate).toHaveBeenCalledWith('/1');
  });

  it('should display loading spinner during API fetch', async () => {
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

  it('should display book information from results list', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: mockBookDetailsAPI,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<BookDetails />);

    expect(screen.getByText('Test Book Title')).toBeInTheDocument();
    expect(screen.getByText('Test Author, Second Author')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();
    expect(
      screen.getByText('Test Publisher, Another Publisher')
    ).toBeInTheDocument();
  });

  it('should display book cover with correct URL', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: mockBookDetailsAPI,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<BookDetails />);

    const coverImage = screen.getByAltText('Test Book Title');
    expect(coverImage).toBeInTheDocument();
    expect(coverImage).toHaveAttribute(
      'src',
      expect.stringContaining('123456-L.jpg')
    );
  });

  it('should handle image load error correctly', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: mockBookDetailsAPI,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<BookDetails />);

    const coverImage = screen.getByAltText('Test Book Title');

    fireEvent.error(coverImage);

    expect(coverImage.style.display).toBe('none');
  });

  it('should fetch and display additional book details from API', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: mockBookDetailsAPI,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<BookDetails />);

    expect(
      screen.getByText(
        'This is a detailed description from the API about the test book.'
      )
    ).toBeInTheDocument();

    expect(screen.getByText('300')).toBeInTheDocument();
    expect(screen.getByText('ENG, SPA')).toBeInTheDocument();
  });

  it('should handle API fetch error gracefully', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: null,
      isLoading: false,
      error: 'Failed to fetch book details: Unknown error',
    });

    renderWithProviders(<BookDetails />);

    expect(
      screen.getByText(
        /Error loading additional details: Failed to fetch book details: Unknown error/
      )
    ).toBeInTheDocument();
  });

  it('should handle network error gracefully', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: null,
      isLoading: false,
      error: 'Failed to fetch book details: FETCH_ERROR',
    });

    renderWithProviders(<BookDetails />);

    expect(
      screen.getByText(
        /Error loading additional details: Failed to fetch book details: FETCH_ERROR/
      )
    ).toBeInTheDocument();
  });

  it('should display no additional info message when API returns empty data', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: {},
      isLoading: false,
      error: null,
    });

    renderWithProviders(<BookDetails />);

    expect(
      screen.getByText('No additional information available from the API')
    ).toBeInTheDocument();
  });

  it('should format languages correctly', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: mockBookDetailsAPI,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<BookDetails />);

    expect(screen.getByText('ENG, SPA')).toBeInTheDocument();
  });

  it('should handle empty languages array', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: {
        ...mockBookDetailsAPI,
        languages: [],
      },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<BookDetails />);

    expect(screen.queryByText('Languages:')).not.toBeInTheDocument();
  });

  it('should handle string description format', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: {
        ...mockBookDetailsAPI,
        description: 'Simple string description',
      },
      isLoading: false,
      error: null,
    });

    renderWithProviders(<BookDetails />);

    expect(screen.getByText('Simple string description')).toBeInTheDocument();
  });

  it('should display all info sections when book has complete data', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: mockBookDetailsAPI,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<BookDetails />);

    expect(screen.getByText('Authors:')).toBeInTheDocument();
    expect(screen.getByText('First Published:')).toBeInTheDocument();
    expect(screen.getByText('Publishers:')).toBeInTheDocument();
    expect(screen.getByText('Subjects:')).toBeInTheDocument();
    expect(screen.getByText('Additional Information:')).toBeInTheDocument();
  });

  it('should have correct CSS classes applied', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: mockBookDetailsAPI,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<BookDetails />);

    expect(screen.getByTestId('book-details-panel')).toBeInTheDocument();
    expect(screen.getByTestId('book-details-header')).toBeInTheDocument();
    expect(
      screen.getByText('Test Book Title').closest('.book-main-info')
    ).toBeInTheDocument();
  });

  it('should limit displayed subjects to 8 items', async () => {
    const { useBookDetails } = await import('../hooks/useBookDetails');

    const bookWithManySubjects = {
      ...mockBookFromList,
      subject: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    };

    mockUseOutletContext.mockReturnValue({
      results: [bookWithManySubjects],
    });

    vi.mocked(useBookDetails).mockReturnValue({
      bookDetailsAPI: mockBookDetailsAPI,
      isLoading: false,
      error: null,
    });

    renderWithProviders(<BookDetails />);

    const subjectsText = screen.getByText(/1, 2, 3, 4, 5, 6, 7, 8/);
    expect(subjectsText).toBeInTheDocument();
    expect(subjectsText.textContent).not.toContain('9');
  });
});
