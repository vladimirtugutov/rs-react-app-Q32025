import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SearchProvider } from './SearchProvider';
import SearchContext from './SearchContext';
import { useContext } from 'react';

const mockNavigate = vi.fn();

const TestConsumer = () => {
  const context = useContext(SearchContext);
  if (!context) return null;
  return (
    <div>
      <input
        data-testid="search-input"
        value={context.searchValue}
        onChange={(e) => context.setSearchValue(e.target.value)}
      />
      <button
        data-testid="search-submit"
        onClick={context.handleSearchButtonClick}
      >
        Search
      </button>
    </div>
  );
};

describe('SearchProvider Advanced Coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ docs: [], numFound: 0 }),
        })
      )
    );
  });

  it('should parse complex API error message with details JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 422,
          json: () =>
            Promise.resolve({
              detail: [{ msg: 'Invalid page number format' }],
            }),
        })
      )
    );

    render(
      <SearchProvider currentPage={1} navigate={mockNavigate}>
        {({ error }) => <div data-testid="error-container">{error}</div>}
      </SearchProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-container')).toHaveTextContent(
        'API Error: 422 (Unprocessable Content) - Invalid page number format'
      );
    });
  });

  it('should handle search button submit and update local storage', async () => {
    const storageSpy = vi.spyOn(Storage.prototype, 'setItem');

    render(
      <SearchProvider currentPage={1} navigate={mockNavigate}>
        <TestConsumer />
      </SearchProvider>
    );

    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'Sanderson' } });

    const button = screen.getByTestId('search-submit');
    fireEvent.click(button);

    expect(storageSpy).toHaveBeenCalledWith(expect.any(String), 'Sanderson');
    expect(mockNavigate).toHaveBeenCalledWith('/1');
  });

  it('should format URL correctly on page change', () => {
    let capturedOnPageChange: ((page: number) => void) | undefined;

    render(
      <SearchProvider
        currentPage={1}
        detailsId="OL123W"
        navigate={mockNavigate}
      >
        {(props) => {
          capturedOnPageChange = props.onPageChange;
          return null;
        }}
      </SearchProvider>
    );

    if (capturedOnPageChange) capturedOnPageChange(3);
    expect(mockNavigate).toHaveBeenCalledWith('/3/OL123W');

    render(
      <SearchProvider currentPage={1} navigate={mockNavigate}>
        {(props) => {
          capturedOnPageChange = props.onPageChange;
          return null;
        }}
      </SearchProvider>
    );

    if (capturedOnPageChange) capturedOnPageChange(5);
    expect(mockNavigate).toHaveBeenCalledWith('/5');
  });

  it('should render standard children element if children is not a function', () => {
    render(
      <SearchProvider currentPage={1} navigate={mockNavigate}>
        <div data-testid="static-child">Hello Static</div>
      </SearchProvider>
    );

    expect(screen.getByTestId('static-child')).toBeInTheDocument();
  });
});
