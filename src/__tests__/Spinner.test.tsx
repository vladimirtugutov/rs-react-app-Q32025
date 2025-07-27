import { render } from '@testing-library/react';
import Spinner from '../spinner/Spinner';

describe('Spinner', () => {
  it('renders spinner container and spinner element', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('.spinner-container')).toBeInTheDocument();
    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });
});
