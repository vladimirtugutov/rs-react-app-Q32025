import { BooksApiState } from '../../types/bookApi';

export const selectBooksApiState = (state: BooksApiState) => state.booksApi;
