import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { ErrorBoundary } from './components/error-boundary/error-boundary';
import { LOCAL_STORAGE_KEYS } from './constants';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch as typeof fetch;

const mockPokemon = {
  name: 'pikachu',
  sprites: { front_default: 'url-to-sprite' },
};

const mockSpecies = {
  flavor_text_entries: [
    { flavor_text: 'Electric mouse.', language: { name: 'en' } },
  ],
};

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render without crashing and fetch initial data', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [{ name: 'pikachu', url: 'url' }] }),
      })
      .mockResolvedValueOnce({ json: async () => mockPokemon })
      .mockResolvedValueOnce({ json: async () => mockSpecies });

    render(<App />);
    expect(await screen.findByText(/pikachu/i)).toBeInTheDocument();
  });

  it('should render spinner during loading', async () => {
    mockFetch.mockImplementation(async () => {
      return { ok: true, json: async () => ({ results: [] }) };
    });

    render(<App />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should handle API error gracefully with human-readable message', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404 });

    render(<App />);
    expect(await screen.findByText(/Pokemon not found/i)).toBeInTheDocument();
  });

  it('should be caught by ErrorBoundary when error button is clicked', async () => {
    render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );

    const errorButton = screen.getByText(/error button/i);
    await userEvent.click(errorButton);
    expect(screen.getByText(/Simulated error/i)).toBeInTheDocument();
  });

  it('should save search term to localStorage when search is performed', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    });
    render(<App />);

    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /search button/i });

    await userEvent.clear(input);
    await userEvent.type(input, 'pikachu');
    await userEvent.click(button);

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      LOCAL_STORAGE_KEYS.PREV_SEARCH,
      'pikachu'
    );
  });
});
