'use client';
import { useState, useCallback, useMemo, useEffect } from 'react';
import SearchContext from './SearchContext';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { API_CONFIG } from '../../constants/api';
import { useBooks } from '../../hooks/useBooks';
import { ReactNode } from 'react';
import { Book } from '../../types/book';

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
};

export const SearchProvider = ({
  children,
  currentPage,
  navigate,
}: SearchProviderProps) => {
  const [searchValue, setSearchValueState] = useState('');
  const [savedSearchTerm, setSavedSearchTerm] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialSearchValue =
        localStorage.getItem(STORAGE_KEYS.PREV_SEARCH_VALUE) || '';
      setSearchValueState(initialSearchValue);
      setSavedSearchTerm(initialSearchValue);
    }
  }, []);

  const {
    books: results,
    totalResults,
    totalPages: calculatedTotalPages,
    isLoading,
    error,
    refetch,
  } = useBooks({
    searchTerm: savedSearchTerm,
    page: currentPage,
    enabled: true,
  });

  const handleSearchButtonClick = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.PREV_SEARCH_VALUE, searchValue);
    setSavedSearchTerm(searchValue);
    navigate('/1');
  }, [searchValue, navigate]);

  const setSearchValue = useCallback((newValue: string) => {
    setSearchValueState(newValue);
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const newUrl = `/${newPage}`;
      navigate(newUrl);
    },
    [navigate]
  );

  const totalPages =
    calculatedTotalPages || Math.ceil(totalResults / API_CONFIG.ITEMS_PER_PAGE);

  const contextValue = useMemo(
    () => ({
      searchValue,
      setSearchValue,
      handleSearchButtonClick,
    }),
    [searchValue, setSearchValue, handleSearchButtonClick]
  );

  return (
    <SearchContext.Provider value={contextValue}>
      {typeof children === 'function'
        ? children({
            isLoading,
            error,
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
