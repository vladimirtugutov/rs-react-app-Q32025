import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

const ThrowError = (): never => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders fallback UI when a child throws an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /refresh/i })
    ).toBeInTheDocument();
  });

  it('calls logErrorToServices when error is caught', () => {
    const spy = vi.spyOn(console, 'log');

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(spy).toHaveBeenCalledWith(
      expect.stringMatching(/^Error: Test error/),
      expect.stringContaining('ThrowError')
    );
  });

  it('refreshes the page when Refresh Page button is clicked', () => {
    const mockHistory = vi
      .spyOn(globalThis.history, 'go')
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText(/refresh page/i));
    expect(mockHistory).toHaveBeenCalledWith(0);

    mockHistory.mockRestore();
  });
});
