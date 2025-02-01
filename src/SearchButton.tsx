import React from 'react';
import SearchContext from './SearchContext';

class SearchButton extends React.Component {
  render() {
    return (
      <SearchContext.Consumer>
        {(context) => (
          <button onClick={context.handleSearchButtonClick}>
            Search Button
          </button>
        )}
      </SearchContext.Consumer>
    );
  }
}

export default SearchButton;
