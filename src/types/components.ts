import { ReactNode } from 'react';
import { Book, BookDetailsAPI } from './book';

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

export type BookMainInfoProps = {
  book: Book;
  getCoverUrl: (coverId: number) => string;
};

export type BookAdditionalInfoProps = {
  data: BookDetailsAPI | null;
  error: string | null;
  getDescription: (desc: string | { value: string } | undefined) => string;
  formatLanguages: (langs?: Array<{ key: string }>) => string;
};
