import React from 'react';
import SearchInput from './SearchInput';
import SearchButton from './SearchButton';

type TopControlsState = {
  searchValue: string;
};

type TopControlsProps = {
  handleButtonClick: () => void;
  handleInputChange: (value: string) => void;
  searchValue: string;
};

class TopControls extends React.Component<TopControlsProps, TopControlsState> {
  state: TopControlsState = {
    searchValue: 'initial',
  };

  render() {
    return (
      <div className="top-controls">
        <SearchInput
          value={this.props.searchValue}
          onChange={this.props.handleInputChange}
        />
        <SearchButton onClick={this.props.handleButtonClick} />
      </div>
    );
  }
}

export default TopControls;
