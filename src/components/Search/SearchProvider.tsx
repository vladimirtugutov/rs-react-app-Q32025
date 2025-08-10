import { useState, useCallback, useMemo } from 'react';
import SearchContext from './SearchContext';
import { STORAGE_KEYS } from '../../constants/storageKeys';
import { API_CONFIG } from '../../constants/api';
import { useBooks } from '../../hooks/useBooks';
import { useCacheInvalidation } from '../../hooks/useCacheInvalidation';
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
  detailsId?: string;
  navigate: (url: string) => void;
  children: ReactNode | ((props: SearchProviderChildrenProps) => ReactNode);
};

export const SearchProvider = ({
  children,
  currentPage,
  detailsId,
  navigate,
}: SearchProviderProps) => {
  const initialSearchValue =
    localStorage.getItem(STORAGE_KEYS.PREV_SEARCH_VALUE) || '';

  const [searchValue, setSearchValueState] = useState(initialSearchValue);
  const [savedSearchTerm, setSavedSearchTerm] = useState(initialSearchValue);

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

  const { refreshBooks } = useCacheInvalidation();

  const handleSearchButtonClick = useCallback(async () => {
    localStorage.setItem(STORAGE_KEYS.PREV_SEARCH_VALUE, searchValue);
    setSavedSearchTerm(searchValue);
    navigate('/1');

    refreshBooks();
  }, [searchValue, navigate, refreshBooks]);

  const setSearchValue = useCallback((newValue: string) => {
    setSearchValueState(newValue);
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      const newUrl = detailsId ? `/${newPage}/${detailsId}` : `/${newPage}`;
      navigate(newUrl);
    },
    [detailsId, navigate]
  );

  const handleManualRefresh = useCallback(() => {
    refreshBooks();
    refetch();
  }, [refreshBooks, refetch]);

  const totalPages =
    calculatedTotalPages || Math.ceil(totalResults / API_CONFIG.ITEMS_PER_PAGE);

  const contextValue = useMemo(
    () => ({
      searchValue,
      setSearchValue,
      handleSearchButtonClick,
      handleManualRefresh,
    }),
    [searchValue, setSearchValue, handleSearchButtonClick, handleManualRefresh]
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
            onManualRefresh: handleManualRefresh,
          })
        : children}
    </SearchContext.Provider>
  );
};
