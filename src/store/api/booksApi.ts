import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG, API_ENDPOINTS } from '../../constants/api';
import {
  Book,
  BookDetailsAPI,
  OpenLibraryBook,
  OpenLibraryResponse,
} from '../../types/book';
import { getBooksQueryUrl, generateDescription } from './booksApiHelpers';
import { BooksApiTags } from './booksApiTags';
import { GetBooksParams, GetBooksResponse } from '../../types/bookApi';

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
  }),

  tagTypes: [BooksApiTags.Books, BooksApiTags.BookDetails],

  endpoints: (builder) => ({
    getBooks: builder.query<GetBooksResponse, GetBooksParams>({
      query: ({ searchTerm = '', page = 1 }) =>
        getBooksQueryUrl(searchTerm, page, API_CONFIG.ITEMS_PER_PAGE),

      transformResponse: (response: OpenLibraryResponse): GetBooksResponse => {
        const mappedResults: Book[] = response.docs.map(
          (book: OpenLibraryBook) => ({
            title: book.title || 'Название не указано',
            author_name: book.author_name || [],
            first_publish_year: book.first_publish_year,
            cover_i: book.cover_i,
            isbn: book.isbn,
            subject: book.subject,
            publisher: book.publisher,
            key: book.key,
            description: generateDescription(book),
          })
        );

        return {
          books: mappedResults,
          totalResults: response.numFound,
          totalPages: Math.ceil(response.numFound / API_CONFIG.ITEMS_PER_PAGE),
        };
      },

      providesTags: (_result, _error, { searchTerm, page }) => [
        { type: BooksApiTags.Books, id: `${searchTerm || 'all'}-${page}` },
        { type: BooksApiTags.Books, id: 'LIST' },
      ],

      keepUnusedDataFor: Number(import.meta.env.VITE_CACHE_TTL) || 300,
    }),

    getBookDetails: builder.query<BookDetailsAPI, string>({
      query: (bookId) => ({
        url: `${API_ENDPOINTS.BOOK_DETAILS}/${bookId}.json`,
        method: 'GET',
      }),

      providesTags: (_result, _error, bookId) => [
        { type: BooksApiTags.BookDetails, id: bookId },
      ],

      keepUnusedDataFor: 600,
    }),
  }),
});

export const {
  useGetBooksQuery,
  useGetBookDetailsQuery,
  useLazyGetBooksQuery,
  useLazyGetBookDetailsQuery,
} = booksApi;

export const {
  util: { invalidateTags, resetApiState },
} = booksApi;

export default booksApi;
