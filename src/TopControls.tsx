import React from 'react';
import SearchInput from './SearchInput';
import SearchButton from './SearchButton';

type TopControlsState = {
  searchValue: string;
};

class TopControls extends React.Component<
  Record<string, never>,
  TopControlsState
> {
  state: TopControlsState = {
    searchValue: 'initial',
  };

  componentDidMount(): void {
    const prevSearchValue = localStorage.getItem('prevSearchValue');
    this.setState({ searchValue: prevSearchValue ?? '' });
  }

  handleSearchChange = (newValue: string) => {
    this.setState({ searchValue: newValue });
  };

  handleSearchClick = () => {
    console.log('Button click!', this.state.searchValue);

    localStorage.setItem('prevSearchValue', this.state.searchValue);
  };

  render() {
    return (
      <>
        <SearchInput
          value={this.state.searchValue}
          onChange={this.handleSearchChange}
        />
        <SearchButton onClick={this.handleSearchClick} />
      </>
    );
  }
}

export default TopControls;
