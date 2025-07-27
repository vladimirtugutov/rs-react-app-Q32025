import React from 'react';
import { SearchContextType } from '../types/components';

const defaultValues: SearchContextType = {
  searchValue: '',
  setSearchValue: () => {},
  handleSearchButtonClick: () => {},
};

const SearchContext = React.createContext<SearchContextType>(defaultValues);

export default SearchContext;
