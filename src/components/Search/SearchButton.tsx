import { useContext } from 'react';
import SearchContext from './SearchContext';

function SearchButton() {
  const context = useContext(SearchContext);

  return (
    <button
      onClick={context.handleSearchButtonClick}
      className="top-controls-button"
    >
      Search Button
    </button>
  );
}

export default SearchButton;
