import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import TopControls from '../topcontrols/TopControls';
import Results from '../results/Results';
import Spinner from '../spinner/Spinner';
import BookDetails from '../book-details/BookDetails';
import About from '../about/About';
import NotFound from '../not-found/NotFound';
import SearchContext from '../search/SearchContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './App.css';

export type Book = {
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

const ITEMS_PER_PAGE = 10;

function App() {
  const [hasSimulatedError, setHasSimulatedError] = useState(false);

  const handleErrorButtonClick = () => {
    setHasSimulatedError(true);
  };

  if (hasSimulatedError) {
    throw new Error('Simulated error by Error Button click.');
  }

  return (
    <div className="app-container">
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/:page?/:detailsId?" element={<MainLayout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <div className="error-button-container">
        <button onClick={handleErrorButtonClick}>Error Button</button>
      </div>
    </div>
  );
}

function MainLayout() {
  const [results, setResults] = useState<Book[]>([]);
  const [searchValue, setSearchValueState] = useLocalStorage(
    'prevSearchValue',
    ''
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  const { page = '1', detailsId } = useParams();
  const navigate = useNavigate();

  const currentPage = parseInt(page, 10);

  const generateDescription = useCallback((book: OpenLibraryBook): string => {
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
  }, []);

  const getResults = useCallback(
    async (searchTerm = '', pageNum = 1): Promise<void> => {
      setLoading(true);
      setError(null);

      const baseUrl = 'https://openlibrary.org/search.json';

      try {
        searchTerm = searchTerm.trim();
        const offset = (pageNum - 1) * ITEMS_PER_PAGE;

        const url = searchTerm
          ? `${baseUrl}?title=${encodeURIComponent(searchTerm)}&limit=${ITEMS_PER_PAGE}&offset=${offset}&fields=key,title,author_name,cover_i,first_publish_year,publisher,subject&sort=rating`
          : `${baseUrl}?q=*&limit=${ITEMS_PER_PAGE}&offset=${offset}&fields=key,title,author_name,cover_i,first_publish_year,publisher,subject&sort=rating`;

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
          description: generateDescription(book),
        }));

        setResults(results);
        setTotalResults(data.numFound);
        setLoading(false);
      } catch (error) {
        console.log(error, typeof error, (error as Error)?.message);
        setError((error as Error).message);
        setLoading(false);
      }
    },
    [generateDescription]
  );

  useEffect(() => {
    getResults(searchValue, currentPage);
  }, [getResults, searchValue, currentPage]);

  const handleSearchButtonClick = useCallback(async () => {
    navigate('/1');
    await getResults(searchValue, 1);
  }, [searchValue, getResults, navigate]);

  const setSearchValue = useCallback(
    (newValue: string) => {
      setSearchValueState(newValue);
    },
    [setSearchValueState]
  );

  const handlePageChange = (newPage: number) => {
    const newUrl = detailsId ? `/${newPage}/${detailsId}` : `/${newPage}`;
    navigate(newUrl);
  };

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE);

  return (
    <SearchContext.Provider
      value={{
        searchValue,
        handleSearchButtonClick,
        setSearchValue,
      }}
    >
      <TopControls />
      <MainContent
        loading={loading}
        error={error}
        results={results}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </SearchContext.Provider>
  );
}

type MainContentProps = {
  loading: boolean;
  error: string | null;
  results: Book[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function MainContent({
  loading,
  error,
  results,
  currentPage,
  totalPages,
  onPageChange,
}: MainContentProps) {
  const { detailsId, page = '1' } = useParams();
  const navigate = useNavigate();

  const handleMainPanelClick = () => {
    if (detailsId) {
      navigate(`/${page}`);
    }
  };

  return (
    <div className="main-content">
      <div className="results-section" onClick={handleMainPanelClick}>
        {loading && !error ? (
          <Spinner />
        ) : (
          <>
            <Results results={results} error={error} />
            {results.length > 0 && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            )}
          </>
        )}
      </div>
      {detailsId && <BookDetails results={results} />}
    </div>
  );
}

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {getVisiblePages().map((page, index) => (
        <button
          key={index}
          onClick={() =>
            typeof page === 'number' ? onPageChange(page) : undefined
          }
          className={currentPage === page ? 'active' : ''}
          disabled={typeof page !== 'number'}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default App;
