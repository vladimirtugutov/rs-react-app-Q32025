import React from 'react';
import TopControls from './TopControls';
import Results from './Results';
import Spinner from './Spinner';
import SearchContext from './SearchContext';
import './App.css';

type Pokemon = {
  name: string;
  sprites?: {
    front_default: string;
  };
  description?: string;
};

type AppState = {
  results: Pokemon[];
  searchValue: string;
  loading: boolean;
  error: string | null;
  hasSimulatedError: boolean;
};

type FlavorTextEntry = {
  flavor_text: string;
  language: {
    name: string;
  };
};

type SpeciesData = {
  flavor_text_entries: FlavorTextEntry[];
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

    const baseUrl = 'https://pokeapi.co/api/v2/pokemon';

    try {
      searchTerm = searchTerm.trim();
      const url = searchTerm
        ? `${baseUrl}/${searchTerm.toLowerCase()}`
        : `${baseUrl}?limit=10`;

      const res = await fetch(url);
      await new Promise((r) => setTimeout(r, 500));

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();

      let results: Pokemon[];

      if (searchTerm) {
        const speciesRes = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${searchTerm.toLowerCase()}`
        );
        const speciesData: SpeciesData = await speciesRes.json();

        const description =
          speciesData.flavor_text_entries
            .find((entry) => entry.language.name === 'en')
            ?.flavor_text.replace(/\f/g, ' ') ?? '';

        results = [{ ...data, description }];
      } else {
        results = await Promise.all(
          data.results.map(async (item: { name: string; url: string }) => {
            const res = await fetch(item.url);
            const pokemon = await res.json();

            const speciesRes = await fetch(
              `https://pokeapi.co/api/v2/pokemon-species/${item.name}`
            );
            const speciesData: SpeciesData = await speciesRes.json();

            const description =
              speciesData.flavor_text_entries
                .find((entry) => entry.language.name === 'en')
                ?.flavor_text.replace(/\f/g, ' ') ?? '';

            return { ...pokemon, description };
          })
        );
      }

      this.setState({ results, loading: false, error: null });
    } catch (error) {
      console.log(error, typeof error, (error as Error)?.message);
      this.setState({ error: (error as Error).message, loading: false });
    }
  };

  handleSearchButtonClick = async () => {
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
