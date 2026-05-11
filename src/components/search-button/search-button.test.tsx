import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { SearchButton } from './search-button';
import { SearchContext } from '../../SearchContext';

describe('SearchButton', () => {
  it('should render a button with correct text', () => {
    render(
      <SearchContext.Provider
        value={{
          searchValue: '',
          setSearchValue: vi.fn(),
          handleSearchButtonClick: vi.fn(),
        }}
      >
        <SearchButton />
      </SearchContext.Provider>
    );
    expect(
      screen.getByRole('button', { name: /search button/i })
    ).toBeInTheDocument();
  });

  it('should call handleSearchButtonClick from context when clicked', () => {
    const handleClick = vi.fn();
    render(
      <SearchContext.Provider
        value={{
          searchValue: '',
          setSearchValue: vi.fn(),
          handleSearchButtonClick: handleClick,
        }}
      >
        <SearchButton />
      </SearchContext.Provider>
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalled();
  });
});
