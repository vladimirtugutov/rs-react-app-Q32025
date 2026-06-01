import SearchContext from './SearchContext';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { SearchProviderProps } from '../types/components';
import { useBookSearch } from './useBookSearch';

export const SearchProvider = ({
  children,
  currentPage,
  detailsId,
  navigate,
}: SearchProviderProps) => {
  const {
    results,
    searchValue,
    setSearchValue,
    setSavedSearchTerm,
    isLoading,
    error,
    totalPages,
  } = useBookSearch({ currentPage });

  const handleSearchButtonClick = async () => {
    const trimmed = searchValue.trim();
    localStorage.setItem(STORAGE_KEYS.PREV_SEARCH_VALUE, trimmed);
    setSavedSearchTerm(trimmed);
    navigate('/1');
  };

  const handlePageChange = (newPage: number) => {
    const newUrl = detailsId ? `/${newPage}/${detailsId}` : `/${newPage}`;
    navigate(newUrl);
  };

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
