import React from 'react';
import TopControls from './components/top-controls/top-controls';
import { Results } from './components/results/results';
import Spinner from './components/spinner/spinner';
import SearchContext from './SearchContext';
import { Pokemon, SpeciesData } from './types';
import { API_BASE_URL, API_SPECIES_URL, LOCAL_STORAGE_KEYS } from './constants';
import './App.css';

type AppState = {
  results: Pokemon[];
  searchValue: string;
  loading: boolean;
  error: string | null;
  hasSimulatedError: boolean;
};

export class App extends React.Component<Record<string, never>, AppState> {
  private _isMounted = false;

  state: AppState = {
    results: [],
    searchValue: localStorage.getItem(LOCAL_STORAGE_KEYS.PREV_SEARCH) || '',
    loading: false,
    error: null,
    hasSimulatedError: false,
  };

  async componentDidMount(): Promise<void> {
    this._isMounted = true;
    const prevSearchValue =
      localStorage.getItem(LOCAL_STORAGE_KEYS.PREV_SEARCH) ?? '';
    this.setState({ searchValue: prevSearchValue });
    await this.getResults(prevSearchValue);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getResults = async (searchTerm = ''): Promise<void> => {
    if (!this._isMounted) return;
    this.setState({ loading: true });

    try {
      const trimmedSearch = searchTerm.trim().toLowerCase();
      const url = trimmedSearch
        ? `${API_BASE_URL}/${trimmedSearch}`
        : `${API_BASE_URL}?limit=10`;

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const data = await res.json();
      let results: Pokemon[];

      if (trimmedSearch) {
        const speciesRes = await fetch(`${API_SPECIES_URL}/${trimmedSearch}`);
        const speciesData: SpeciesData = await speciesRes.json();

        const description =
          speciesData.flavor_text_entries
            .find((entry) => entry.language.name === 'en')
            ?.flavor_text.replace(/\f/g, ' ') ?? '';

        results = [{ ...data, description }];
      } else {
        results = await Promise.all(
          data.results.map(async (item: { name: string; url: string }) => {
            const pokemonRes = await fetch(item.url);
            const pokemon = await pokemonRes.json();

            const speciesRes = await fetch(`${API_SPECIES_URL}/${item.name}`);
            const speciesData: SpeciesData = await speciesRes.json();

            const description =
              speciesData.flavor_text_entries
                .find((entry) => entry.language.name === 'en')
                ?.flavor_text.replace(/\f/g, ' ') ?? '';

            return { ...pokemon, description };
          })
        );
      }

      if (this._isMounted) {
        this.setState({ results, loading: false, error: null });
      }
    } catch (error) {
      if (this._isMounted) {
        this.setState({ error: (error as Error).message, loading: false });
      }
    }
  };

  handleSearchButtonClick = async () => {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.PREV_SEARCH,
      this.state.searchValue
    );
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
