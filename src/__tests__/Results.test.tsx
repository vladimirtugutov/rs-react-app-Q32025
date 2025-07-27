import { render, screen } from '@testing-library/react';
import Results from '../results/Results';

describe('Results component', () => {
  it('renders message when there are no results', () => {
    render(<Results results={[]} error={null} />);
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it('renders error message when error is passed', () => {
    render(<Results results={[]} error="Something went wrong" />);
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it('renders list of Pokémon with name and image', () => {
    const mockResults = [
      {
        name: 'bulbasaur',
        sprites: {
          front_default: 'https://example.com/bulbasaur.png',
        },
      },
      {
        name: 'charmander',
        sprites: {
          front_default: 'https://example.com/charmander.png',
        },
      },
    ];

    render(<Results results={mockResults} error={null} />);

    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
    expect(screen.getByText(/charmander/i)).toBeInTheDocument();

    expect(screen.getByAltText(/bulbasaur/i)).toHaveAttribute(
      'src',
      'https://example.com/bulbasaur.png'
    );
    expect(screen.getByAltText(/charmander/i)).toHaveAttribute(
      'src',
      'https://example.com/charmander.png'
    );
  });
});
