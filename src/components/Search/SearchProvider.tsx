'use client';
import { useState, useCallback, useMemo, useEffect } from 'react';
import SearchContext from './SearchContext';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { API_CONFIG } from '../../constants/api';
import { useBooks } from '../../hooks/useBooks';
import { ReactNode } from 'react';
import { Book, OpenLibraryResponse, OpenLibraryBook } from '@/types/book';

type SearchProviderChildrenProps = {
  isLoading: boolean;
  error: string | null;
  results: Book[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onManualRefresh?: () => void;
};

export type SearchProviderProps = {
  currentPage: number;
  navigate: (url: string) => void;
  children: ReactNode | ((props: SearchProviderChildrenProps) => ReactNode);
  detailsId?: string;
  initialData?: OpenLibraryResponse;
  initialQuery?: string;
  initialError?: string | null;
};

const transformOpenLibraryBook = (doc: OpenLibraryBook): Book => ({
  key: doc.key,
  title: doc.title || '',
  author_name: doc.author_name ?? [],
  first_publish_year: doc.first_publish_year,
  cover_i: doc.cover_i,
  subject: doc.subject ?? [],
  isbn: doc.isbn ?? [],
  publisher: doc.publisher ?? [],
});

export const SearchProvider = ({
  children,
  currentPage,
  navigate,
  initialData,
  initialQuery,
  initialError,
}: SearchProviderProps) => {
  const [searchValue, setSearchValueState] = useState(initialQuery || '');
  const [savedSearchTerm, setSavedSearchTerm] = useState(initialQuery || '');
  const [hasInitialized, setHasInitialized] = useState(false);
  const [shouldUseInitialData, setShouldUseInitialData] =
    useState(!!initialData);

  useEffect(() => {
    if (typeof window !== 'undefined' && !hasInitialized) {
      if (!initialQuery) {
        const storedSearchValue =
          localStorage.getItem(STORAGE_KEYS.PREV_SEARCH_VALUE) || '';
        setSearchValueState(storedSearchValue);
        setSavedSearchTerm(storedSearchValue);
      } else {
        localStorage.setItem(STORAGE_KEYS.PREV_SEARCH_VALUE, initialQuery);
      }
      setHasInitialized(true);
    }
  }, [initialQuery, hasInitialized]);

  useEffect(() => {
    if (savedSearchTerm !== initialQuery || currentPage !== 1) {
      setShouldUseInitialData(false);
    }
  }, [savedSearchTerm, initialQuery, currentPage]);

  const {
    books: apiResults,
    totalResults,
    totalPages: calculatedTotalPages,
    isLoading,
    error: apiError,
    refetch,
  } = useBooks({
    searchTerm: savedSearchTerm,
    page: currentPage,
    enabled: hasInitialized && !shouldUseInitialData,
  });

  const results = useMemo(() => {
    if (shouldUseInitialData && initialData) {
      return initialData.docs.map(transformOpenLibraryBook);
    }
    return apiResults || [];
  }, [shouldUseInitialData, initialData, apiResults]);

  const totalPages = useMemo(() => {
    if (shouldUseInitialData && initialData) {
      return Math.ceil(initialData.numFound / API_CONFIG.ITEMS_PER_PAGE);
    }
    return (
      calculatedTotalPages ||
      Math.ceil(totalResults / API_CONFIG.ITEMS_PER_PAGE)
    );
  }, [shouldUseInitialData, initialData, calculatedTotalPages, totalResults]);

  const handleSearchButtonClick = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.PREV_SEARCH_VALUE, searchValue);
    setSavedSearchTerm(searchValue);
    setShouldUseInitialData(false);
    navigate('/1');
  }, [searchValue, navigate]);

  const setSearchValue = useCallback((newValue: string) => {
    setSearchValueState(newValue);
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setShouldUseInitialData(false);
      const newUrl = `/${newPage}`;
      navigate(newUrl);
    },
    [navigate]
  );

  const contextValue = useMemo(
    () => ({
      searchValue,
      setSearchValue,
      handleSearchButtonClick,
    }),
    [searchValue, setSearchValue, handleSearchButtonClick]
  );

  const shouldShowLoading = !shouldUseInitialData && isLoading;
  const finalError = initialError || apiError;

  return (
    <SearchContext.Provider value={contextValue}>
      {typeof children === 'function'
        ? children({
            isLoading: shouldShowLoading,
            error: finalError,
            results,
            currentPage,
            totalPages,
            onPageChange: handlePageChange,
            onManualRefresh: refetch,
          })
        : children}
    </SearchContext.Provider>
  );
};
