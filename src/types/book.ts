export type Book = {
  title: string;
  author_name: string[];
  first_publish_year?: number;
  cover_i?: number;
  isbn?: string[];
  subject?: string[];
  publisher?: string[];
  description?: string;
  key?: string;
};

export type OpenLibraryBook = {
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  isbn?: string[];
  subject?: string[];
  publisher?: string[];
  key?: string;
};

export type OpenLibraryResponse = {
  docs: OpenLibraryBook[];
  numFound: number;
  start: number;
};

export type BookDetailsAPI = {
  title?: string;
  description?: string | { value: string };
  subjects?: string[];
  covers?: number[];
  authors?: Array<{
    author: {
      key: string;
    };
  }>;
  publishers?: string[];
  publish_date?: string;
  isbn_10?: string[];
  isbn_13?: string[];
  number_of_pages?: number;
  languages?: Array<{
    key: string;
  }>;
};
