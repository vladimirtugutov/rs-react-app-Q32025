import React from 'react';
import { SearchInput } from '../search-input/search-input';
import { SearchButton } from '../search-button/search-button';

export class TopControls extends React.Component {
  render() {
    return (
      <div className="top-controls">
        <SearchInput />
        <SearchButton />
      </div>
    );
  }
}
