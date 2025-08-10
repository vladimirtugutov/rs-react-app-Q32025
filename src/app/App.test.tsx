import { render, screen, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { App } from './App';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import selectedItemsReducer from '../store/selectedItemsSlice';
import { booksApi } from '../store/api/booksApi';

vi.mock('../hooks/useBooks', () => ({
  useBooks: vi.fn(),
}));

vi.mock('../hooks/useCacheInvalidation', () => ({
  useCacheInvalidation: vi.fn(() => ({
    refreshBooks: vi.fn(),
  })),
}));

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
      [booksApi.reducerPath]: booksApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(booksApi.middleware),
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

const mockOpenLibraryResponse = [
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
];

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
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: mockOpenLibraryResponse,
      totalResults: 25,
      totalPages: 3,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    await act(async () => {
      renderWithProviders(<App />);
    });

    expect(await screen.findByText('Test Book')).toBeInTheDocument();
    expect(await screen.findByText('Another Book')).toBeInTheDocument();
  });

  it('should render spinner during loading', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: [],
      totalResults: 0,
      totalPages: 0,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    await act(async () => {
      renderWithProviders(<App />);
    });

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should handle API error gracefully', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: [],
      totalResults: 0,
      totalPages: 0,
      isLoading: false,
      error: 'Failed to fetch books',
      refetch: vi.fn(),
    });

    await act(async () => {
      renderWithProviders(<App />);
    });

    expect(
      await screen.findByText(/Failed to fetch books/)
    ).toBeInTheDocument();
  });

  it('should simulate error button click and be caught by ErrorBoundary', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: [],
      totalResults: 0,
      totalPages: 0,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithProvidersAndErrorBoundary(<App />);

    const errorButton = screen.getByText('Error Button');
    await userEvent.click(errorButton);

    expect(
      screen.getByText(/Error: Simulated error by Error Button click/i)
    ).toBeInTheDocument();
  });

  it('should render main navigation routes', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: [],
      totalResults: 0,
      totalPages: 0,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithProviders(<App />);

    expect(screen.getByText('Error Button')).toBeInTheDocument();
  });

  it('should load saved search value from localStorage', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    const savedSearchValue = 'saved search';
    localStorageMock.getItem.mockReturnValue(savedSearchValue);

    vi.mocked(useBooks).mockReturnValue({
      books: mockOpenLibraryResponse,
      totalResults: 25,
      totalPages: 3,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithProviders(<App />);

    await waitFor(() => {
      expect(localStorageMock.getItem).toHaveBeenCalledWith('prevSearchValue');
    });
  });

  it('should handle search functionality', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: mockOpenLibraryResponse,
      totalResults: 25,
      totalPages: 3,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithProviders(<App />);

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });
  });

  it('should handle pagination when results are available', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: mockOpenLibraryResponse,
      totalResults: 100,
      totalPages: 10,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    await act(async () => {
      renderWithProviders(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('should not show pagination when results fit on one page', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: [mockOpenLibraryResponse[0]],
      totalResults: 1,
      totalPages: 1,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    await act(async () => {
      renderWithProviders(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });

    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('should display no results message when API returns empty results', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: [],
      totalResults: 0,
      totalPages: 0,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    await act(async () => {
      renderWithProviders(<App />);
    });

    expect(
      await screen.findByText(/No books found|нет результатов|No results/i)
    ).toBeInTheDocument();
  });

  it('should generate correct book descriptions', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: mockOpenLibraryResponse,
      totalResults: 2,
      totalPages: 1,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    await act(async () => {
      renderWithProviders(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Book')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Another Book')).toBeInTheDocument();
    expect(screen.getByText('by Test Author')).toBeInTheDocument();
    expect(screen.getByText('by Another Author')).toBeInTheDocument();
  });

  it('should handle network errors correctly', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: [],
      totalResults: 0,
      totalPages: 0,
      isLoading: false,
      error: 'Network error',
      refetch: vi.fn(),
    });

    renderWithProviders(<App />);

    expect(
      await screen.findByText(/Failed to fetch books|Network error/)
    ).toBeInTheDocument();
  });

  it('should maintain app container structure', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: [],
      totalResults: 0,
      totalPages: 0,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithProviders(<App />);

    const appContainer = screen
      .getByText('Error Button')
      .closest('.app-container');
    expect(appContainer).toBeInTheDocument();
  });

  it('should render theme selector', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: [],
      totalResults: 0,
      totalPages: 0,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithProviders(<App />);

    expect(screen.getByTestId('theme-selector')).toBeInTheDocument();
    expect(screen.getByTestId('theme-toggle-button')).toBeInTheDocument();
    expect(screen.getByTestId('theme-label')).toBeInTheDocument();
  });

  it('should display current theme', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: [],
      totalResults: 0,
      totalPages: 0,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithProviders(<App />);

    const themeLabel = screen.getByTestId('theme-label');
    expect(themeLabel).toHaveTextContent('Theme: light');
  });

  it('should toggle theme when button is clicked', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: [],
      totalResults: 0,
      totalPages: 0,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    const user = userEvent.setup();
    renderWithProviders(<App />);

    const toggleButton = screen.getByTestId('theme-toggle-button');
    const themeLabel = screen.getByTestId('theme-label');

    expect(themeLabel).toHaveTextContent('Theme: light');

    await user.click(toggleButton);

    expect(themeLabel).toHaveTextContent('Theme: dark');
  });

  it('should not show flyout when no items selected', async () => {
    const { useBooks } = await import('../hooks/useBooks');

    vi.mocked(useBooks).mockReturnValue({
      books: [],
      totalResults: 0,
      totalPages: 0,
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });

    renderWithProviders(<App />);

    expect(screen.queryByText(/items selected/)).not.toBeInTheDocument();
  });
});
