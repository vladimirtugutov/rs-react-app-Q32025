import React from 'react';
import './App.css';
import TopControls from './TopControls';
import Results from './Results';

type AppState = {
  results: [];
  searchValue: string;
};

class App extends React.Component<Record<string, never>, AppState> {
  state: AppState = {
    results: [],
    searchValue: localStorage.getItem('prevSearchValue') || '',
  };

  async componentDidMount(): Promise<void> {
    const prevSearchValue = localStorage.getItem('prevSearchValue');
    this.setState({ searchValue: prevSearchValue ?? '' });
    await this.getResults();
  }

  getResults = async (): Promise<void> => {
    const res = await fetch('https://swapi.dev/api/people/?page=1');
    const data = await res.json();
    const { results } = data;
    this.setState({ results });
  };

  handleButtonClick = async () => {
    console.log('Button click!', this.state.searchValue);

    localStorage.setItem('prevSearchValue', this.state.searchValue);
  };

  handleInputChange = (newValue: string) => {
    this.setState({ searchValue: newValue });
  };

  render() {
    return (
      <>
        <TopControls
          handleButtonClick={this.handleButtonClick}
          handleInputChange={this.handleInputChange}
          searchValue={this.state.searchValue}
        />
        <Results results={this.state.results} />
      </>
    );
  }
}

export default App;
