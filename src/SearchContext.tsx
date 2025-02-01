import React from 'react';

interface SearchContextType {
  searchValue: string;
  setSearchValue: (value: string) => void;
  handleSearchButtonClick: () => void;
}

const defaultValues: SearchContextType = {
  searchValue: '',
  setSearchValue: () => {},
  handleSearchButtonClick: () => {},
};

const SearchContext = React.createContext<SearchContextType>(defaultValues);

export default SearchContext;
