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
import { STORAGE_KEYS } from '../constants/storageKeys';
import { API_CONFIG } from '../constants/api';
import { Book, OpenLibraryBook, OpenLibraryResponse } from '../types/book';
import { MainContentProps, PaginationProps } from '../types/components';
import './App.css';

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
        <Route path="/:page?/:detailsId?" element={<ValidatedMainLayout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <div className="error-button-container">
        <button onClick={handleErrorButtonClick}>Error Button</button>
      </div>
    </div>
  );
}

function ValidatedMainLayout() {
  const { page = '1' } = useParams();

  const pageNum = parseInt(page, 10);
  if (isNaN(pageNum) || pageNum < 1) {
    return <NotFound />;
  }

  return <MainLayout />;
}

function MainLayout() {
  const [results, setResults] = useState<Book[]>([]);
  const [searchValue, setSearchValueState] = useLocalStorage(
    STORAGE_KEYS.PREV_SEARCH_VALUE,
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

      try {
        searchTerm = searchTerm.trim();
        const offset = (pageNum - 1) * API_CONFIG.ITEMS_PER_PAGE;

        const url = searchTerm
          ? `${API_CONFIG.BASE_URL}?title=${encodeURIComponent(searchTerm)}&limit=${API_CONFIG.ITEMS_PER_PAGE}&offset=${offset}&fields=key,title,author_name,cover_i,first_publish_year,publisher,subject&sort=rating`
          : `${API_CONFIG.BASE_URL}?q=*&limit=${API_CONFIG.ITEMS_PER_PAGE}&offset=${offset}&fields=key,title,author_name,cover_i,first_publish_year,publisher,subject&sort=rating`;

        const res = await fetch(url);
        await new Promise((r) => setTimeout(r, API_CONFIG.REQUEST_DELAY));

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
      } catch (error) {
        console.error('Error fetching results:', error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [generateDescription]
  );

  useEffect(() => {
    const savedSearchValue =
      localStorage.getItem(STORAGE_KEYS.PREV_SEARCH_VALUE) || '';
    getResults(savedSearchValue, currentPage);
  }, [getResults, currentPage]);

  const handleSearchButtonClick = useCallback(async () => {
    localStorage.setItem(STORAGE_KEYS.PREV_SEARCH_VALUE, searchValue);
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

  const totalPages = Math.ceil(totalResults / API_CONFIG.ITEMS_PER_PAGE);

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
