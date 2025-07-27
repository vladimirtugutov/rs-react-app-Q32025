import { render, screen, fireEvent } from '@testing-library/react';
import SearchButton from '../search/SearchButton';
import SearchContext from '../search/SearchContext';

describe('SearchButton', () => {
  it('renders a button with label', () => {
    render(
      <SearchContext.Provider
        value={{
          searchValue: '',
          setSearchValue: vi.fn(),
          handleSearchButtonClick: vi.fn(),
        }}
      >
        <SearchButton onClick={() => {}} />
      </SearchContext.Provider>
    );
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(/search button/i);
  });

  it('calls handleSearchButtonClick from context when clicked', () => {
    const handleClick = vi.fn();

    render(
      <SearchContext.Provider
        value={{
          searchValue: '',
          setSearchValue: vi.fn(),
          handleSearchButtonClick: handleClick,
        }}
      >
        <SearchButton onClick={() => {}} />
      </SearchContext.Provider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
  });
});
