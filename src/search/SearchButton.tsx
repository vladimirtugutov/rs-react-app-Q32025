import { useContext } from 'react';
import SearchContext from './SearchContext';

function SearchButton() {
  const context = useContext(SearchContext);

  return (
    <button onClick={context.handleSearchButtonClick}>Search Button</button>
  );
}

export default SearchButton;
