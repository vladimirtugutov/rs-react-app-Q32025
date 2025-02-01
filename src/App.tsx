import React from 'react';
import TopControls from './TopControls';
import Results from './Results';
import Spinner from './Spinner';
import SearchContext from './SearchContext';
import './App.css';

type AppState = {
  results: [];
  searchValue: string;
  loading: boolean;
  error: string | null;
  hasSimulatedError: boolean;
};

class App extends React.Component<Record<string, never>, AppState> {
  state: AppState = {
    results: [],
    searchValue: localStorage.getItem('prevSearchValue') || '',
    loading: false,
    error: null,
    hasSimulatedError: false,
  };

  async componentDidMount(): Promise<void> {
    const prevSearchValue = localStorage.getItem('prevSearchValue') ?? '';
    this.setState({ searchValue: prevSearchValue });
    await this.getResults(prevSearchValue);
  }

  getResults = async (searchTerm = ''): Promise<void> => {
    this.setState({ loading: true });

    try {
      searchTerm = searchTerm.trim();
      const searchQuery = searchTerm ? `&search=${searchTerm}` : '';
      const res = await fetch(
        'https://swapi.dev/api/people/?page=1' + searchQuery
      );
      const data = await res.json();
      const { results } = data;
      this.setState({ results, loading: false });
    } catch (error) {
      console.log(error, typeof error, (error as Error)?.message);

      this.setState({ error: (error as Error).message, loading: false });
    }
  };

  handleSearchButtonClick = async () => {
    console.log('Button click!', this.state.searchValue);

    localStorage.setItem('prevSearchValue', this.state.searchValue);

    await this.getResults(this.state.searchValue);
  };

  setSearchValue = (newValue: string) => {
    this.setState({ searchValue: newValue });
  };

  handleErrorButtonClick = () => {
    this.setState({ hasSimulatedError: true });
  };

  render() {
    if (this.state.hasSimulatedError) {
      throw new Error('Simulated error by Error Button click.');
    }
    return (
      <div className="app-container">
        <SearchContext.Provider
          value={{
            searchValue: this.state.searchValue,
            handleSearchButtonClick: this.handleSearchButtonClick,
            setSearchValue: this.setSearchValue,
          }}
        >
          <TopControls />
        </SearchContext.Provider>

        <div className="results-wrapper">
          {this.state.loading && !this.state.error ? (
            <Spinner />
          ) : (
            <Results results={this.state.results} error={this.state.error} />
          )}
        </div>

        <div className="error-button-container">
          <button onClick={this.handleErrorButtonClick}>Error Button</button>
        </div>
      </div>
    );
  }
}

export default App;
