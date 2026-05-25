import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { App } from './App';
import { ErrorBoundary } from '../components/ErrorBoundary/ErrorBoundary';
import selectedItemsReducer from '../store/selectedItemsSlice';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch as typeof fetch;

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

const createTestStore = () => {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
  });
};

const renderWithProviders = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(<Provider store={store}>{component}</Provider>);
};

const renderWithProvidersAndErrorBoundary = (component: React.ReactElement) => {
  const store = createTestStore();
  return render(
    <Provider store={store}>
      <ErrorBoundary>{component}</ErrorBoundary>
    </Provider>
  );
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
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render without crashing and fetch initial data', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockOpenLibraryResponse,
    });

    renderWithProviders(<App />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    expect(await screen.findByText('Test Book')).toBeInTheDocument();
    expect(await screen.findByText('Another Book')).toBeInTheDocument();
  });

  it('should render spinner during loading', async () => {
    mockFetch.mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 100));
      return {
        ok: true,
        json: async () => ({ docs: [], numFound: 0, start: 0 }),
      };
    });

    renderWithProviders(<App />);

    expect(screen.getByRole('status')).toBeInTheDocument();

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
  });

  it('should handle API error gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}),
    });

    renderWithProviders(<App />);

    expect(await screen.findByText(/API Error: 500/)).toBeInTheDocument();
  });

  it('should simulate error button click and be caught by ErrorBoundary', async () => {
    renderWithProvidersAndErrorBoundary(<App />);

    const errorButton = screen.getByText('Error Button');
    await userEvent.click(errorButton);

    expect(
      screen.getByText(/Error: Simulated error by Error Button click/i)
    ).toBeInTheDocument();
  });

  it('should render main navigation routes', () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ docs: [], numFound: 0, start: 0 }),
    });

    renderWithProviders(<App />);

    expect(screen.getByText('Error Button')).toBeInTheDocument();
  });

  it('should load saved search value from localStorage', async () => {
    const savedSearchValue = 'saved search';
    localStorageMock.getItem.mockReturnValue(savedSearchValue);

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockOpenLibraryResponse,
    });

    renderWithProviders(<App />);

    await waitFor(() => {
      expect(localStorageMock.getItem).toHaveBeenCalledWith('prevSearchValue');
    });
  });

  it('should handle search functionality', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockOpenLibraryResponse,
    });

    renderWithProviders(<App />);

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

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => largeResponse,
    });

    renderWithProviders(<App />);

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

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => smallResponse,
    });

    renderWithProviders(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });

    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('should display no results message when API returns empty results', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ docs: [], numFound: 0, start: 0 }),
    });

    renderWithProviders(<App />);

    expect(await screen.findByText(/нет результатов/i)).toBeInTheDocument();
  });

  it('should generate correct book descriptions', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockOpenLibraryResponse,
    });

    renderWithProviders(<App />);

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

    renderWithProviders(<App />);

    expect(await screen.findByText(/Network error/)).toBeInTheDocument();
  });

  it('should maintain app container structure', () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ docs: [], numFound: 0, start: 0 }),
    });

    renderWithProviders(<App />);

    const appContainer = screen
      .getByText('Error Button')
      .closest('.app-container');
    expect(appContainer).toBeInTheDocument();
  });

  it('should render theme selector', () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ docs: [], numFound: 0, start: 0 }),
    });

    renderWithProviders(<App />);

    expect(screen.getByTestId('theme-selector')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle-button')).toBeInTheDocument();
    expect(screen.getByTestId('theme-label')).toBeInTheDocument();
  });

  it('should display current theme', () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ docs: [], numFound: 0, start: 0 }),
    });

    renderWithProviders(<App />);

    const themeLabel = screen.getByTestId('theme-label');
    expect(themeLabel).toHaveTextContent('Theme: light');
  });

  it('should toggle theme when button is clicked', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ docs: [], numFound: 0, start: 0 }),
    });

    const user = userEvent.setup();
    renderWithProviders(<App />);

    const toggleButton = screen.getByTestId('theme-toggle-button');
    const themeLabel = screen.getByTestId('theme-label');

    expect(themeLabel).toHaveTextContent('Theme: light');

    await user.click(toggleButton);

    expect(themeLabel).toHaveTextContent('Theme: dark');
  });

  it('should not show flyout when no items selected', () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ docs: [], numFound: 0, start: 0 }),
    });

    renderWithProviders(<App />);

    expect(screen.queryByText(/items selected/)).not.toBeInTheDocument();
  });
});
