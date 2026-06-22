import { ReactNode } from 'react';
import { Book, BookDetailsAPI } from './book';

export type ErrorBoundaryProps = {
  children: ReactNode;
};

export type ErrorBoundaryState = {
  errorMessage: string;
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
