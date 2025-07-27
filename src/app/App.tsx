import React from 'react';
import TopControls from '../topcontrols/TopControls';
import Results from '../results/Results';
import Spinner from '../spinner/Spinner';
import SearchContext from '../search/SearchContext';
import './App.css';

type AppState = {
  results: Book[];
  searchValue: string;
  loading: boolean;
  error: string | null;
  hasSimulatedError: boolean;
};

type Book = {
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  isbn?: string[];
  subject?: string[];
  publisher?: string[];
  description?: string;
  key?: string;
};

// Типы для ответа Open Library API
type OpenLibraryBook = {
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  isbn?: string[];
  subject?: string[];
  publisher?: string[];
  key?: string;
};

type OpenLibraryResponse = {
  docs: OpenLibraryBook[];
  numFound: number;
  start: number;
};

class App extends React.Component<Record<string, never>, AppState> {
  private _isMounted = false;

  state: AppState = {
    results: [],
    searchValue: localStorage.getItem('prevSearchValue') || '',
    loading: false,
    error: null,
    hasSimulatedError: false,
  };

  async componentDidMount(): Promise<void> {
    this._isMounted = true;
    const prevSearchValue = localStorage.getItem('prevSearchValue') ?? '';
    this.setState({ searchValue: prevSearchValue });
    await this.getResults(prevSearchValue);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getResults = async (searchTerm = ''): Promise<void> => {
    if (!this._isMounted) return;
    this.setState({ loading: true });

    const baseUrl = 'https://openlibrary.org/search.json';

    try {
      searchTerm = searchTerm.trim();

      const url = searchTerm
        ? `${baseUrl}?title=${encodeURIComponent(searchTerm)}&limit=10&fields=key,title,author_name,cover_i,first_publish_year,publisher&sort=rating`
        : `${baseUrl}?q=*&limit=10&fields=key,title,author_name,cover_i,first_publish_year,publisher&sort=rating`;

      const res = await fetch(url);
      await new Promise((r) => setTimeout(r, 500));

      if (!res.ok) {
        throw new Error(`API Error: ${res.status}`);
      }

      const data: OpenLibraryResponse = await res.json();

      const results: Book[] = data.docs.map((book: OpenLibraryBook) => ({
        title: book.title || 'Название не указано',
        author_name: book.author_name || [],
        first_publish_year: book.first_publish_year,
        cover_i: book.cover_i,
        isbn: book.isbn,
        subject: book.subject,
        publisher: book.publisher,
        key: book.key,
        description: this.generateDescription(book),
      }));

      if (this._isMounted) {
        this.setState({ results, loading: false, error: null });
      }
    } catch (error) {
      console.log(error, typeof error, (error as Error)?.message);
      if (this._isMounted) {
        this.setState({ error: (error as Error).message, loading: false });
      }
    }
  };

  private generateDescription = (book: OpenLibraryBook): string => {
    const parts: string[] = [];

    if (book.author_name && book.author_name.length > 0) {
      parts.push(`Author: ${book.author_name.slice(0, 2).join(', ')}`);
    }

    if (book.first_publish_year) {
      parts.push(`First publish year: ${book.first_publish_year}`);
    }

    if (book.publisher && book.publisher.length > 0) {
      parts.push(`Publisher: ${book.publisher[0]}`);
    }

    if (book.subject && book.subject.length > 0) {
      parts.push(`Subject: ${book.subject.slice(0, 3).join(', ')}`);
    }

    return parts.join(' • ');
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
