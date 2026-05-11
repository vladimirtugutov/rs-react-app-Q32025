import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import ErrorBoundary from '../ErrorBoundary';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';

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

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders without crashing and fetches initial data', async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ results: [{ name: 'pikachu', url: 'some-url' }] }),
      })
      .mockResolvedValueOnce({
        json: async () => mockPokemon,
      })
      .mockResolvedValueOnce({
        json: async () => mockSpecies,
      });

    render(<App />);
    expect(await screen.findByText(/pikachu/i)).toBeInTheDocument();
  });

  it('renders spinner during loading', async () => {
    mockFetch.mockImplementation(async () => {
      await new Promise((r) => setTimeout(r, 100));
      return { ok: true, json: async () => ({ results: [] }) };
    });

    render(<App />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
  });

  it('handles API error gracefully', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    render(<App />);
    expect(await screen.findByText(/API Error/)).toBeInTheDocument();
  });

  it('simulates error button click and is caught by ErrorBoundary', async () => {
    render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );

    const errorButton = screen.getByText(/error button/i);
    await userEvent.click(errorButton);

    expect(
      screen.getByText(/Error: Simulated error by Error Button click/i)
    ).toBeInTheDocument();
  });

  const LOCAL_STORAGE_KEY = 'prevSearchValue';

  it('saves search term to localStorage when search is performed', async () => {
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

    expect(localStorage.getItem(LOCAL_STORAGE_KEY)).toBe('pikachu');
  });

  it('loads search term from localStorage on mount', async () => {
    localStorage.setItem(LOCAL_STORAGE_KEY, 'bulbasaur');

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    });

    render(<App />);

    const input = screen.getByRole('textbox') as HTMLInputElement;

    await waitFor(() => {
      expect(input.value).toBe('bulbasaur');
    });
  });
});
