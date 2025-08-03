import { ReactNode } from 'react';
import { Book } from './book';

export type ErrorBoundaryProps = {
  children: ReactNode;
};

export type ErrorBoundaryState = {
  errorMessage: string;
};

export type ResultsProps = {
  results: Book[];
  error: string | null;
};

export type BookDetailsProps = {
  results: Book[];
};

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export type MainContentProps = {
  loading: boolean;
  error: string | null;
  results: Book[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export type SearchContextType = {
  searchValue: string;
  setSearchValue: (value: string) => void;
  handleSearchButtonClick: () => void;
};

export type InfoSectionProps = {
  title: string;
  children: React.ReactNode;
};
