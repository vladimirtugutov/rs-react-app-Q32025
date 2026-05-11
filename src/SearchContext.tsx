import React from 'react';
import { SearchContextType } from './types';

const defaultValues: SearchContextType = {
  searchValue: '',
  setSearchValue: () => {},
  handleSearchButtonClick: () => {},
};

export const SearchContext =
  React.createContext<SearchContextType>(defaultValues);
