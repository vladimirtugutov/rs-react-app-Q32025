import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import ErrorBoundary from '../error-boundary/ErrorBoundary';

class MockRequest {
  public url: string;
  public method: string;
  public headers: Headers;
  public credentials?: RequestCredentials;
  public signal?: AbortSignal;

  constructor(input: string | URL | Request, init?: RequestInit) {
    this.url = typeof input === 'string' ? input : input.toString();
    this.method = init?.method ?? 'GET';
    this.headers =
      init?.headers instanceof Headers
        ? init.headers
        : new Headers(init?.headers);
    this.credentials = init?.credentials;
    this.signal = init?.signal ?? undefined;
  }
}

class MockResponse {
  public status: number;
  public ok: boolean;
  public headers: Headers;
  private _body: unknown;

  constructor(body?: unknown, init?: ResponseInit) {
    this._body = body;
    this.status = init?.status || 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.headers =
      init?.headers instanceof Headers
        ? init.headers
        : new Headers(init?.headers);
  }

  public async json(): Promise<unknown> {
    return typeof this._body === 'string' ? JSON.parse(this._body) : this._body;
  }
}

const mockFetch = vi.fn<typeof fetch>();

const localStorageMock = {
  getItem: vi.fn<(key: string) => string | null>(),
  setItem: vi.fn<(key: string, value: string) => void>(),
  clear: vi.fn<() => void>(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const renderWithRouter = (component: React.ReactElement) => {
  return render(component);
};

const renderWithRouterAndErrorBoundary = (component: React.ReactElement) => {
  return render(<ErrorBoundary>{component}</ErrorBoundary>);
};

const mockOpenLibraryResponse = {
  docs: [
    {
      key: '/works/OL123456W',
      title: 'Test Book',
      author_name: ['Test Author'],
      first_publish_year: 2020,
      cover_i: 123456,
      publisher: ['Test Publisher'],
      subject: ['Fiction', 'Adventure'],
    },
    {
      key: '/works/OL789012W',
      title: 'Another Book',
      author_name: ['Another Author'],
      first_publish_year: 2021,
      cover_i: 789012,
      publisher: ['Another Publisher'],
      subject: ['Non-fiction'],
    },
  ],
  numFound: 25,
  start: 0,
};

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    localStorageMock.getItem.mockReturnValue('');

    vi.stubGlobal('fetch', mockFetch);
    vi.stubGlobal('Request', MockRequest);
    vi.stubGlobal('Response', MockResponse);
    vi.stubGlobal('AbortSignal', window.AbortSignal);

    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should render without crashing and fetch initial data', async () => {
    mockFetch.mockResolvedValueOnce(
      new MockResponse(mockOpenLibraryResponse) as unknown as Response
    );

    renderWithRouter(<App />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    expect(await screen.findByText('Test Book')).toBeInTheDocument();
    expect(await screen.findByText('Another Book')).toBeInTheDocument();
  });

  it('should render spinner during loading', async () => {
    mockFetch.mockImplementationOnce(async () => {
      await new Promise((r) => setTimeout(r, 100));
      return new MockResponse({
        docs: [],
        numFound: 0,
        start: 0,
      }) as unknown as Response;
    });

    renderWithRouter(<App />);

    expect(screen.getByRole('status')).toBeInTheDocument();

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
  });

  it('should handle API error gracefully', async () => {
    mockFetch.mockResolvedValueOnce(
      new MockResponse({}, { status: 500 }) as unknown as Response
    );

    renderWithRouter(<App />);

    expect(await screen.findByText(/API Error: 500/)).toBeInTheDocument();
  });

  it('should simulate error button click and be caught by ErrorBoundary', async () => {
    renderWithRouterAndErrorBoundary(<App />);

    const errorButton = screen.getByText(/error button/i);
    await userEvent.click(errorButton);

    expect(
      screen.getByText(/Error: Simulated error by Error Button click/i)
    ).toBeInTheDocument();
  });

  it('should render main navigation routes', () => {
    mockFetch.mockResolvedValueOnce(
      new MockResponse({
        docs: [],
        numFound: 0,
        start: 0,
      }) as unknown as Response
    );

    renderWithRouter(<App />);

    expect(screen.getByText(/error button/i)).toBeInTheDocument();
  });

  it('should load saved search value from localStorage', async () => {
    const savedSearchValue = 'saved search';
    localStorageMock.getItem.mockReturnValue(savedSearchValue);

    mockFetch.mockResolvedValueOnce(
      new MockResponse(mockOpenLibraryResponse) as unknown as Response
    );

    renderWithRouter(<App />);

    await waitFor(() => {
      expect(localStorageMock.getItem).toHaveBeenCalledWith('prevSearchValue');
    });
  });

  it('should handle search functionality', async () => {
    mockFetch.mockResolvedValueOnce(
      new MockResponse(mockOpenLibraryResponse) as unknown as Response
    );

    renderWithRouter(<App />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://openlibrary.org/search.json')
      );
    });
  });

  it('should handle pagination when results are available', async () => {
    const largeResponse = {
      ...mockOpenLibraryResponse,
      numFound: 100,
    };

    mockFetch.mockResolvedValueOnce(
      new MockResponse(largeResponse) as unknown as Response
    );

    renderWithRouter(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('should not show pagination when results fit on one page', async () => {
    const smallResponse = {
      docs: [mockOpenLibraryResponse.docs[0]],
      numFound: 1,
      start: 0,
    };

    mockFetch.mockResolvedValueOnce(
      new MockResponse(smallResponse) as unknown as Response
    );

    renderWithRouter(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });

    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('should display no results message when API returns empty results', async () => {
    mockFetch.mockResolvedValueOnce(
      new MockResponse({
        docs: [],
        numFound: 0,
        start: 0,
      }) as unknown as Response
    );

    renderWithRouter(<App />);

    expect(await screen.findByText(/no results/i)).toBeInTheDocument();
  });

  it('should generate correct book descriptions', async () => {
    mockFetch.mockResolvedValueOnce(
      new MockResponse(mockOpenLibraryResponse) as unknown as Response
    );

    renderWithRouter(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Another Book')).toBeInTheDocument();

    expect(screen.getByText('by Test Author')).toBeInTheDocument();
    expect(screen.getByText('by Another Author')).toBeInTheDocument();
  });

  it('should handle network errors correctly', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    renderWithRouter(<App />);

    expect(await screen.findByText(/Network error/)).toBeInTheDocument();
  });

  it('should maintain app container structure', () => {
    mockFetch.mockResolvedValueOnce(
      new MockResponse({
        docs: [],
        numFound: 0,
        start: 0,
      }) as unknown as Response
    );

    renderWithRouter(<App />);

    const appContainer = screen
      .getByText(/error button/i)
      .closest('.app-container');
    expect(appContainer).toBeInTheDocument();
  });
});
