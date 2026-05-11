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
  lastExecutedSearch: string;
  loading: boolean;
  error: string | null;
  hasSimulatedError: boolean;
};

export class App extends React.Component<Record<string, never>, AppState> {
  private _isMounted = false;

  state: AppState = {
    results: [],
    searchValue: localStorage.getItem(LOCAL_STORAGE_KEYS.PREV_SEARCH) || '',
    lastExecutedSearch: '',
    loading: false,
    error: null,
    hasSimulatedError: false,
  };

  async componentDidMount(): Promise<void> {
    this._isMounted = true;
    const savedSearch =
      localStorage.getItem(LOCAL_STORAGE_KEYS.PREV_SEARCH) ?? '';
    this.setState({ searchValue: savedSearch });
    await this.getResults(savedSearch, true);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getResults = async (
    searchTerm = '',
    isInitialLoad = false
  ): Promise<void> => {
    if (!this._isMounted) return;

    const trimmedSearch = searchTerm.trim();

    if (
      !isInitialLoad &&
      trimmedSearch.toLowerCase() ===
        this.state.lastExecutedSearch.toLowerCase()
    ) {
      return;
    }

    this.setState({
      loading: true,
      error: null,
      lastExecutedSearch: trimmedSearch,
    });

    try {
      const searchPath = trimmedSearch.toLowerCase();
      const url = searchPath
        ? `${API_BASE_URL}/${searchPath}`
        : `${API_BASE_URL}?limit=10`;

      const res = await fetch(url);

      if (!res.ok) {
        if (res.status === 404)
          throw new Error('Pokemon not found. Please try another name.');
        if (res.status >= 500)
          throw new Error(
            'Server is currently unavailable. Please try again later.'
          );
        throw new Error('Something went wrong. Please check your connection.');
      }

      const data = await res.json();
      let results: Pokemon[];

      if (searchPath) {
        const speciesRes = await fetch(`${API_SPECIES_URL}/${searchPath}`);
        if (!speciesRes.ok)
          throw new Error('Failed to load additional pokemon details.');

        const speciesData: SpeciesData = await speciesRes.json();
        const description =
          speciesData.flavor_text_entries
            .find((entry) => entry.language.name === 'en')
            ?.flavor_text.replace(/\f/g, ' ') ?? '';

        results = [{ ...data, description }];
      } else {
        results = await Promise.all(
          data.results.map(async (item: { name: string; url: string }) => {
            const pRes = await fetch(item.url);
            const pokemon = await pRes.json();
            const sRes = await fetch(`${API_SPECIES_URL}/${item.name}`);
            const sData: SpeciesData = await sRes.json();
            const desc =
              sData.flavor_text_entries
                .find((e) => e.language.name === 'en')
                ?.flavor_text.replace(/\f/g, ' ') ?? '';
            return { ...pokemon, description: desc };
          })
        );
      }

      if (this._isMounted) {
        this.setState({ results, loading: false });
      }
    } catch (error) {
      if (this._isMounted) {
        this.setState({
          error: (error as Error).message,
          loading: false,
          results: [],
        });
      }
    }
  };

  handleSearchButtonClick = async () => {
    const trimmed = this.state.searchValue.trim();
    localStorage.setItem(LOCAL_STORAGE_KEYS.PREV_SEARCH, trimmed);
    await this.getResults(trimmed);
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
          {this.state.loading ? (
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
