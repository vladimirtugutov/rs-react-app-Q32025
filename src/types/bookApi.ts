import { Book } from './book';

export type GetBooksParams = {
  searchTerm?: string;
  page: number;
};

export type GetBooksResponse = {
  books: Book[];
  totalResults: number;
  totalPages: number;
};

export type BooksApiState = {
  booksApi: ReturnType<typeof import('../store/api/booksApi').booksApi.reducer>;
};
