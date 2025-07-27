import { useContext } from 'react';
import SearchContext from './SearchContext';

function SearchInput() {
  const context = useContext(SearchContext);

  return (
    <input
      type="text"
      value={context.searchValue}
      onChange={(e) => context.setSearchValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          context.handleSearchButtonClick();
        }
      }}
    />
  );
}

export default SearchInput;
