import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG, API_ENDPOINTS } from '../../constants/api';
import { BookDetailsAPI } from '../../types/book';
import { getBooksQueryUrl } from './booksApiHelpers';
import { BooksApiTags } from './booksApiTags';
import { GetBooksParams, GetBooksResponse } from '../../types/bookApi';
import { transformBooksResponse } from './transformers/booksTransformer';

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

      transformResponse: transformBooksResponse,

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

export type BooksApiState = ReturnType<typeof booksApi.reducer>;
