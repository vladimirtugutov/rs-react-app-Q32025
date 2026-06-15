import { API_CONFIG } from '../../../constants/api';
import {
  Book,
  OpenLibraryBook,
  OpenLibraryResponse,
} from '../../../types/book';
import { GetBooksResponse } from '../../../types/bookApi';
import { generateDescription } from '../booksApiHelpers';

export const transformBooksResponse = (
  response: OpenLibraryResponse
): GetBooksResponse => {
  const books: Book[] = response.docs.map((book: OpenLibraryBook) => ({
    title: book.title || 'Title not specified',
    author_name: book.author_name || [],
    first_publish_year: book.first_publish_year,
    cover_i: book.cover_i,
    isbn: book.isbn,
    subject: book.subject,
    publisher: book.publisher,
    key: book.key,
    description: generateDescription(book),
  }));

  return {
    books,
    totalResults: response.numFound,
    totalPages: Math.ceil(response.numFound / API_CONFIG.ITEMS_PER_PAGE),
  };
};
