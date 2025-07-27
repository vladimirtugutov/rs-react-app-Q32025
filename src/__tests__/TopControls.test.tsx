import { render, screen } from '@testing-library/react';
import TopControls from '../topcontrols/TopControls';
import SearchContext from '../search/SearchContext';

describe('TopControls', () => {
  it('renders SearchInput and SearchButton', () => {
    render(
      <SearchContext.Provider
        value={{
          searchValue: '',
          setSearchValue: vi.fn(),
          handleSearchButtonClick: vi.fn(),
        }}
      >
        <TopControls />
      </SearchContext.Provider>
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /search button/i })
    ).toBeInTheDocument();
  });
});
