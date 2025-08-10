import React from 'react';

export type SearchContextType = {
  searchValue: string;
  setSearchValue: (value: string) => void;
  handleSearchButtonClick: () => void;
  handleManualRefresh?: () => void;
};

const defaultValues: SearchContextType = {
  searchValue: '',
  setSearchValue: () => {},
  handleSearchButtonClick: () => {},
  handleManualRefresh: () => {},
};

const SearchContext = React.createContext<SearchContextType>(defaultValues);

export default SearchContext;
