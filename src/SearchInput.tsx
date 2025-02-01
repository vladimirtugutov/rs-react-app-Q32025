import React from 'react';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
};

class SearchInput extends React.Component<SearchInputProps> {
  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(event.target.value);
  };

  render() {
    return (
      <input
        type="text"
        value={this.props.value}
        onChange={this.handleInputChange}
      ></input>
    );
  }
}

export default SearchInput;
