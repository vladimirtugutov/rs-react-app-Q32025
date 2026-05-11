import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { SearchInput } from './search-input';
import { SearchContext } from '../../SearchContext';

describe('SearchInput component', () => {
  it('should render input with value from context', () => {
    render(
      <SearchContext.Provider
        value={{
          searchValue: 'pikachu',
          setSearchValue: vi.fn(),
          handleSearchButtonClick: vi.fn(),
        }}
      >
        <SearchInput />
      </SearchContext.Provider>
    );
    const input = screen.getByRole('textbox') as HTMLInputElement;
    expect(input.value).toBe('pikachu');
  });

  it('should call setSearchValue on input change', () => {
    const setSearchValueMock = vi.fn();
    render(
      <SearchContext.Provider
        value={{
          searchValue: '',
          setSearchValue: setSearchValueMock,
          handleSearchButtonClick: vi.fn(),
        }}
      >
        <SearchInput />
      </SearchContext.Provider>
    );
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'bulbasaur' },
    });
    expect(setSearchValueMock).toHaveBeenCalledWith('bulbasaur');
  });
});
