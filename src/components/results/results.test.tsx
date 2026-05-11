import { render, screen } from '@testing-library/react';
import { Results } from './results';

describe('Results component', () => {
  it('should render message when there are no results', () => {
    render(<Results results={[]} error={null} />);
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('should render human-readable error message', () => {
    render(<Results results={[]} error="Pokemon not found" />);
    expect(screen.getByText(/pokemon not found/i)).toBeInTheDocument();
  });

  it('should render list of Card components when data is provided', () => {
    const mockResults = [
      {
        name: 'bulbasaur',
        sprites: { front_default: 'https://example.com/b.png' },
      },
    ];
    render(<Results results={mockResults} error={null} />);
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
  });
});
