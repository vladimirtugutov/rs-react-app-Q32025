import { render, screen } from '@testing-library/react';
import { Spinner } from './spinner';

describe('Spinner', () => {
  it('should render spinner element with correct role', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should not be in the document when not rendered (sanity check)', () => {
    render(<div />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
