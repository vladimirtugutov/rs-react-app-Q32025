import React from 'react';
import SearchContext from './SearchContext';

type SearchButtonProps = {
  onClick?: () => void;
};

class SearchButton extends React.Component<SearchButtonProps> {
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
