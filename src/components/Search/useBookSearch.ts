import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { API_CONFIG } from '../../constants/api';
import { Book, OpenLibraryBook, OpenLibraryResponse } from '../../types/book';

type UseBookSearchProps = {
  currentPage: number;
};

export const useBookSearch = ({ currentPage }: UseBookSearchProps) => {
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

  const generateDescription = (book: OpenLibraryBook): string => {
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

  useEffect(() => {
    const getResults = async (searchTerm = '', pageNum = 1): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        const trimmedSearchTerm = searchTerm.trim();
        const offset = (pageNum - 1) * API_CONFIG.ITEMS_PER_PAGE;
        let url = '';

        if (trimmedSearchTerm === '') {
          const fallbackTerm = 'books';
          url = `${API_CONFIG.BASE_URL}?q=${encodeURIComponent(fallbackTerm)}&limit=${API_CONFIG.ITEMS_PER_PAGE}&offset=${offset}&fields=key,title,author_name,cover_i,first_publish_year,publisher,subject&sort=rating`;
        } else {
          url = `${API_CONFIG.BASE_URL}?title=${encodeURIComponent(trimmedSearchTerm)}&limit=${API_CONFIG.ITEMS_PER_PAGE}&offset=${offset}&fields=key,title,author_name,cover_i,first_publish_year,publisher,subject&sort=rating`;
        }

        const res = await fetch(url);
        await new Promise((r) => setTimeout(r, API_CONFIG.REQUEST_DELAY));

        if (!res.ok) {
          let errorMessage = `API Error: ${res.status}`;
          try {
            const errorJson = await res.json();
            if (errorJson?.detail?.[0]?.msg) {
              errorMessage += ` (Unprocessable Content) - ${errorJson.detail[0].msg}`;
            }
          } catch (_e) {
            console.warn(_e);
          }
          throw new Error(errorMessage);
        }

        const data: OpenLibraryResponse = await res.json();

        const mappedResults: Book[] = data.docs.map((book: OpenLibraryBook) => {
          const authors = Array.isArray(book.author_name)
            ? book.author_name
            : [];
          const publishers = Array.isArray(book.publisher)
            ? book.publisher
            : [];
          const subjects = Array.isArray(book.subject) ? book.subject : [];

          return {
            title: book.title || 'Title not specified',
            author_name: authors,
            first_publish_year: book.first_publish_year,
            cover_i: book.cover_i,
            isbn: book.isbn,
            publisher: publishers,
            subject: subjects,
            key: book.key,
            description: generateDescription(book),
          };
        });

        setResults(mappedResults);
        setTotalResults(data.numFound);
      } catch (err) {
        console.error('Error fetching results:', err);
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };

    localStorage.setItem(
      STORAGE_KEYS.PREV_SEARCH_VALUE,
      savedSearchTerm.trim()
    );
    getResults(savedSearchTerm, currentPage);
  }, [currentPage, savedSearchTerm]);

  const MAX_SAFE_PAGES = 1000;
  const calculatedPages = Math.ceil(totalResults / API_CONFIG.ITEMS_PER_PAGE);
  const totalPages = Math.min(calculatedPages, MAX_SAFE_PAGES);

  return {
    results,
    searchValue,
    setSearchValue: setSearchValueState,
    setSavedSearchTerm,
    isLoading,
    error,
    totalPages,
  };
};
