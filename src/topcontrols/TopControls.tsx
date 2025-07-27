import React from 'react';
import SearchInput from '../search/SearchInput';
import SearchButton from '../search/SearchButton';

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
