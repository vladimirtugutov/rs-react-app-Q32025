import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

const ThrowError = (): never => {
  throw new Error('Test error');
};

const NormalComponent = () => <div>Normal component</div>;

describe('ErrorBoundary', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal component')).toBeInTheDocument();
  });

  it('should render fallback UI when a child throws an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Test error/i)).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /refresh page/i })
    ).toBeInTheDocument();
  });

  it('should call logErrorToServices when error is caught', () => {
    const consoleSpy = vi.spyOn(console, 'log');

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringMatching(/^Error: Test error/),
      expect.stringContaining('ThrowError')
    );
  });

  it('should refresh the page when Refresh Page button is clicked', () => {
    const mockHistoryGo = vi
      .spyOn(globalThis.history, 'go')
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const refreshButton = screen.getByRole('button', { name: /refresh page/i });
    fireEvent.click(refreshButton);

    expect(mockHistoryGo).toHaveBeenCalledWith(0);

    mockHistoryGo.mockRestore();
  });

  it('should display the correct error message format', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const errorMessage = screen.getByText(/Error: Test error/i);
    expect(errorMessage).toHaveClass('error-message');
    expect(errorMessage.tagName).toBe('P');
  });

  it('should maintain error state after re-render', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Test error/i)).toBeInTheDocument();

    rerender(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
  });

  it('should use Fragment as wrapper for error UI', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    const errorMessage = screen.getByText(/Error: Test error/i);
    const refreshButton = screen.getByRole('button', { name: /refresh page/i });

    expect(errorMessage.nextSibling).toBe(refreshButton);
  });

  it('should handle different error types correctly', () => {
    const CustomError = () => {
      throw new Error('Custom error message');
    };

    render(
      <ErrorBoundary>
        <CustomError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Custom error message/i)).toBeInTheDocument();
  });
});
