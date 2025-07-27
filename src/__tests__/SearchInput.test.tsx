import { render, screen, fireEvent } from '@testing-library/react';
import SearchInput from '../search/SearchInput';
import SearchContext from '../search/SearchContext';

describe('SearchInput component', () => {
  it('renders input with default value from context', () => {
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
    expect(input).toBeInTheDocument();
    expect(input.value).toBe('pikachu');
  });

  it('calls setSearchValue on input change', () => {
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

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'bulbasaur' } });

    expect(setSearchValueMock).toHaveBeenCalledWith('bulbasaur');
  });
});
