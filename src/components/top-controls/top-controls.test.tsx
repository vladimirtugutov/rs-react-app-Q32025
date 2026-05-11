import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { TopControls } from './top-controls';
import { SearchContext } from '../../SearchContext';

describe('TopControls', () => {
  it('should render SearchInput and SearchButton components', () => {
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
