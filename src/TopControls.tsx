import React from 'react';
import SearchInput from './SearchInput';
import SearchButton from './SearchButton';

class TopControls extends React.Component {
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
