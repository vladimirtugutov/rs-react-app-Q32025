import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG, API_ENDPOINTS } from '../../constants/api';
import {
  Book,
  BookDetailsAPI,
  OpenLibraryBook,
  OpenLibraryResponse,
} from '../../types/book';

type GetBooksParams = {
  searchTerm?: string;
  page: number;
};

type GetBooksResponse = {
  books: Book[];
  totalResults: number;
  totalPages: number;
};

type BooksApiState = {
  booksApi: ReturnType<typeof booksApi.reducer>;
};

const generateDescription = (book: OpenLibraryBook): string => {
  const parts: string[] = [];

  if (book.author_name && book.author_name.length > 0) {
    parts.push(`Author: ${book.author_name.slice(0, 2).join(', ')}`);
  }

  if (book.first_publish_year) {
    parts.push(`First publish year: ${book.first_publish_year}`);
  }

  if (book.publisher && book.publisher.length > 0) {
    parts.push(`Publisher: ${book.publisher[0]}`);
  }

  if (book.subject && book.subject.length > 0) {
    parts.push(`Subject: ${book.subject.slice(0, 3).join(', ')}`);
  }

  return parts.join(' • ');
};

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers) => {
      return headers;
    },
  }),

  tagTypes: ['Books', 'BookDetails'],

  endpoints: (builder) => ({
    getBooks: builder.query<GetBooksResponse, GetBooksParams>({
      query: ({ searchTerm = '', page = 1 }) => {
        const offset = (page - 1) * API_CONFIG.ITEMS_PER_PAGE;

        const url = searchTerm.trim()
          ? `?title=${encodeURIComponent(searchTerm.trim())}&limit=${API_CONFIG.ITEMS_PER_PAGE}&offset=${offset}&fields=key,title,author_name,cover_i,first_publish_year,publisher,subject&sort=rating`
          : `?q=*&limit=${API_CONFIG.ITEMS_PER_PAGE}&offset=${offset}&fields=key,title,author_name,cover_i,first_publish_year,publisher,subject&sort=rating`;

        return url;
      },

      transformResponse: async (
        response: OpenLibraryResponse
      ): Promise<GetBooksResponse> => {
        await new Promise((resolve) =>
          setTimeout(resolve, API_CONFIG.REQUEST_DELAY)
        );

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
        { type: 'Books' as const, id: `${searchTerm || 'all'}-${page}` },
        { type: 'Books' as const, id: 'LIST' },
      ],

      keepUnusedDataFor: 300,
    }),

    getBookDetails: builder.query<BookDetailsAPI, string>({
      query: (bookId) => ({
        url: `${API_ENDPOINTS.BOOK_DETAILS}/${bookId}.json`,
        method: 'GET',
      }),

      providesTags: (_result, _error, bookId) => [
        { type: 'BookDetails' as const, id: bookId },
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

export const selectBooksApiState = (state: BooksApiState) => state.booksApi;

export default booksApi;
