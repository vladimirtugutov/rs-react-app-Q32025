import React from 'react';
import SearchContext from './SearchContext';

class SearchInput extends React.Component {
  render() {
    return (
      <SearchContext.Consumer>
        {(context) => (
          <input
            type="text"
            value={context.searchValue}
            onChange={(e) => context.setSearchValue(e.target.value)}
          />
        )}
      </SearchContext.Consumer>
    );
  }
}

export default SearchInput;
