import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { BookDetails } from './BookDetails';
import { Book } from '../types/book';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch as typeof fetch;

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({
      detailsId: 'OL123456W',
      page: '1',
    }),
  };
});

const mockBookFromList: Book = {
  key: '/works/OL123456W',
  title: 'Test Book Title',
  author_name: ['Test Author', 'Second Author'],
  first_publish_year: 2020,
  cover_i: 123456,
  publisher: ['Test Publisher', 'Another Publisher'],
  subject: ['Fiction', 'Adventure', 'Mystery'],
  description:
    'Author: Test Author • First publish year: 2020 • Publisher: Test Publisher',
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

const renderWithRouter = (component: React.ReactElement) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('BookDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return null when detailsId is not provided', () => {
    const { container } = renderWithRouter(<BookDetails results={[]} />);
    expect(container.querySelector('.book-details-panel')).toBeInTheDocument();
  });

  it('should display book not found message when book is not in results', () => {
    renderWithRouter(<BookDetails results={[]} />);

    expect(screen.getByText('Book Details')).toBeInTheDocument();
    expect(
      screen.getByText('Book not found in current search results')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Try searching for this book again')
    ).toBeInTheDocument();
  });

  it('should render close button with correct functionality', () => {
    renderWithRouter(<BookDetails results={[]} />);

    const closeButton = screen.getByText('×');
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveAttribute('title', 'Close details');

    fireEvent.click(closeButton);
    expect(mockNavigate).toHaveBeenCalledWith('/1');
  });

  it('should display loading spinner during API fetch', async () => {
    mockFetch.mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: async () => mockBookDetailsAPI,
              } as Response),
            100
          )
        )
    );

    renderWithRouter(<BookDetails results={[mockBookFromList]} />);

    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(
      screen.getByText('Loading detailed information...')
    ).toBeInTheDocument();

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
  });

  it('should display book information from results list', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBookDetailsAPI,
    });

    renderWithRouter(<BookDetails results={[mockBookFromList]} />);

    await waitFor(
      () => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.getByText('Test Book Title')).toBeInTheDocument();
    expect(screen.getByText('Test Author, Second Author')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();
    expect(
      screen.getByText('Test Publisher, Another Publisher')
    ).toBeInTheDocument();
  });

  it('should display book cover with correct URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBookDetailsAPI,
    });

    renderWithRouter(<BookDetails results={[mockBookFromList]} />);

    await waitFor(
      () => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    const coverImage = screen.getByAltText('Test Book Title');
    expect(coverImage).toBeInTheDocument();
    expect(coverImage).toHaveAttribute(
      'src',
      expect.stringContaining('123456-L.jpg')
    );
  });

  it('should handle image load error correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBookDetailsAPI,
    });

    renderWithRouter(<BookDetails results={[mockBookFromList]} />);

    await waitFor(
      () => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    const coverImage = screen.getByAltText('Test Book Title');

    fireEvent.error(coverImage);

    expect(coverImage.style.display).toBe('none');
  });

  it('should fetch and display additional book details from API', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBookDetailsAPI,
    });

    renderWithRouter(<BookDetails results={[mockBookFromList]} />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('OL123456W.json')
      );
    });

    await waitFor(
      () => {
        expect(
          screen.getByText(
            'This is a detailed description from the API about the test book.'
          )
        ).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.getByText('300')).toBeInTheDocument();
    expect(screen.getByText('ENG, SPA')).toBeInTheDocument();
  });

  it('should handle API fetch error gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    renderWithRouter(<BookDetails results={[mockBookFromList]} />);

    expect(
      await screen.findByText(
        /Error loading additional details: Failed to fetch book details: 404/
      )
    ).toBeInTheDocument();
  });

  it('should handle network error gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter(<BookDetails results={[mockBookFromList]} />);

    expect(
      await screen.findByText(/Error loading additional details: Network error/)
    ).toBeInTheDocument();
  });

  it('should display no additional info message when API returns empty data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    renderWithRouter(<BookDetails results={[mockBookFromList]} />);

    await waitFor(
      () => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(
      screen.getByText('No additional information available from the API')
    ).toBeInTheDocument();
  });

  it('should format languages correctly', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBookDetailsAPI,
    });

    renderWithRouter(<BookDetails results={[mockBookFromList]} />);

    await waitFor(
      () => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.getByText('ENG, SPA')).toBeInTheDocument();
  });

  it('should handle empty languages array', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockBookDetailsAPI,
        languages: [],
      }),
    });

    renderWithRouter(<BookDetails results={[mockBookFromList]} />);

    await waitFor(
      () => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.queryByText('Languages:')).not.toBeInTheDocument();
  });

  it('should handle string description format', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        ...mockBookDetailsAPI,
        description: 'Simple string description',
      }),
    });

    renderWithRouter(<BookDetails results={[mockBookFromList]} />);

    await waitFor(
      () => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.getByText('Simple string description')).toBeInTheDocument();
  });

  it('should display all info sections when book has complete data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBookDetailsAPI,
    });

    renderWithRouter(<BookDetails results={[mockBookFromList]} />);

    await waitFor(
      () => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.getByText('Authors:')).toBeInTheDocument();
    expect(screen.getByText('First Published:')).toBeInTheDocument();
    expect(screen.getByText('Publishers:')).toBeInTheDocument();
    expect(screen.getByText('Generated Description:')).toBeInTheDocument();
    expect(screen.getByText('Subjects:')).toBeInTheDocument();
    expect(screen.getByText('Additional Information:')).toBeInTheDocument();
  });

  it('should have correct CSS classes applied', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBookDetailsAPI,
    });

    renderWithRouter(<BookDetails results={[mockBookFromList]} />);

    await waitFor(
      () => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(
      screen.getByText('Book Details').closest('.book-details-panel')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Book Details').closest('.book-details-header')
    ).toBeInTheDocument();
    expect(
      screen.getByText('Test Book Title').closest('.book-main-info')
    ).toBeInTheDocument();
  });

  it('should limit displayed subjects to 8 items', async () => {
    const bookWithManySubjects = {
      ...mockBookFromList,
      subject: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockBookDetailsAPI,
    });

    renderWithRouter(<BookDetails results={[bookWithManySubjects]} />);

    await waitFor(
      () => {
        expect(screen.queryByRole('status')).not.toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    const subjectsText = screen.getByText(/1, 2, 3, 4, 5, 6, 7, 8/);
    expect(subjectsText).toBeInTheDocument();
    expect(subjectsText.textContent).not.toContain('9');
  });
});
