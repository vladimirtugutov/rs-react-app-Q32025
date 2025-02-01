import React from 'react';
import './App.css';
import TopControls from './TopControls';
import ResultList from './ResultList';
import Spinner from './Spinner';

type AppState = {
  results: [];
  searchValue: string;
  loading: boolean;
  error: string | null;
};

class App extends React.Component<Record<string, never>, AppState> {
  state: AppState = {
    results: [],
    searchValue: localStorage.getItem('prevSearchValue') || '',
    loading: false,
    error: null,
  };

  async componentDidMount(): Promise<void> {
    const prevSearchValue = localStorage.getItem('prevSearchValue') ?? '';
    this.setState({ searchValue: prevSearchValue });
    await this.getResults(prevSearchValue);
  }

  getResults = async (searchTerm = ''): Promise<void> => {
    this.setState({loading: true});

    try {
      searchTerm = searchTerm.trim();
      const searchQuery = searchTerm ? `&search=${searchTerm}` : '';
      const res = await fetch('https://swapi.dev/api/people/?page=1'+searchQuery);
      const data = await res.json();
      const { results } = data;
      this.setState({ results, loading: false });
    } catch (error) {
      console.log(error, typeof error, (error as Error)?.message);
      
      this.setState({error: (error as Error).message, loading: false});
    }

    
  };

  handleButtonClick = async () => {
    console.log('Button click!', this.state.searchValue);

    localStorage.setItem('prevSearchValue', this.state.searchValue);

    await this.getResults(this.state.searchValue);
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

        {this.state.loading && !this.state.error && <Spinner />}
        {!this.state.loading && !this.state.error && <ResultList results={this.state.results} />}
         {this.state.error && <p style={{ color: "red" }}>{this.state.error}</p>}
      </>
    );
  }
}

export default App;
