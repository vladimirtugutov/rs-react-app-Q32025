import React from 'react';
import { SearchInput } from '../search-input/search-input';
import { SearchButton } from '../search-button/search-button';

class TopControls extends React.Component<Record<string, never>> {
  render() {
    return (
      <div className="top-controls">
        <SearchInput />
        <SearchButton />
      </div>
    );
  }
}

export default TopControls;
