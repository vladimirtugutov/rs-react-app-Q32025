import { useState, useEffect, useCallback } from 'react';
import SearchContext from './SearchContext';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { API_CONFIG } from '../../constants/api';
import { Book, OpenLibraryBook, OpenLibraryResponse } from '../../types/book';
import { SearchProviderProps } from '../../types/components';

export const SearchProvider = ({
  children,
  currentPage,
  detailsId,
  navigate,
}: SearchProviderProps) => {
  const [results, setResults] = useState<Book[]>([]);
  const [searchValue, setSearchValueState] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.PREV_SEARCH_VALUE) || '';
  });

  const [savedSearchTerm, setSavedSearchTerm] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.PREV_SEARCH_VALUE) || '';
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

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
      setIsLoading(true);
      setError(null);

      try {
        searchTerm = searchTerm.trim();
        const offset = (pageNum - 1) * API_CONFIG.ITEMS_PER_PAGE;

        const url = searchTerm
          ? `${API_CONFIG.BASE_URL}?title=${encodeURIComponent(
              searchTerm
            )}&limit=${API_CONFIG.ITEMS_PER_PAGE}&offset=${offset}&fields=key,title,author_name,cover_i,first_publish_year,publisher,subject&sort=rating`
          : `${API_CONFIG.BASE_URL}?q=*&limit=${API_CONFIG.ITEMS_PER_PAGE}&offset=${offset}&fields=key,title,author_name,cover_i,first_publish_year,publisher,subject&sort=rating`;

        const res = await fetch(url);
        await new Promise((r) => setTimeout(r, API_CONFIG.REQUEST_DELAY));

        if (!res.ok) {
          throw new Error(`API Error: ${res.status}`);
        }

        const data: OpenLibraryResponse = await res.json();

        const mappedResults: Book[] = data.docs.map(
          (book: OpenLibraryBook) => ({
            title: book.title || 'Название не указано',
            author_name: book.author_name || [],
            first_publish_year: book.first_publish_year,
            cover_i: book.cover_i,
            isbn: book.isbn,
            subject: book.subject,
            publisher: book.publisher,
            key: book.key,
            description: generateDescription(book),
          })
        );

        setResults(mappedResults);
        setTotalResults(data.numFound);
      } catch (error) {
        console.error('Error fetching results:', error);
        setError((error as Error).message);
      } finally {
        setIsLoading(false);
      }
    },
    [generateDescription]
  );
  useEffect(() => {
    getResults(savedSearchTerm, currentPage);
  }, [getResults, currentPage, savedSearchTerm]);

  const handleSearchButtonClick = useCallback(async () => {
    localStorage.setItem(STORAGE_KEYS.PREV_SEARCH_VALUE, searchValue);
    setSavedSearchTerm(searchValue);
    navigate('/1');

    await getResults(searchValue, 1);
  }, [searchValue, getResults, navigate]);

  const setSearchValue = useCallback((newValue: string) => {
    setSearchValueState(newValue);
  }, []);

  const handlePageChange = (newPage: number) => {
    const newUrl = detailsId ? `/${newPage}/${detailsId}` : `/${newPage}`;
    navigate(newUrl);
  };

  const totalPages = Math.ceil(totalResults / API_CONFIG.ITEMS_PER_PAGE);

  return (
    <SearchContext.Provider
      value={{
        searchValue,
        setSearchValue,
        handleSearchButtonClick,
      }}
    >
      {typeof children === 'function'
        ? children({
            isLoading,
            error,
            results,
            currentPage,
            totalPages,
            onPageChange: handlePageChange,
          })
        : children}
    </SearchContext.Provider>
  );
};
