type BaseBook = Partial<{
  author_name: string[];
  first_publish_year: number;
  cover_i: number;
  isbn: string[];
  subject: string[];
  publisher: string[];
  key: string;
}>;

export type Book = BaseBook & {
  title: string;
  description?: string;
};

export type OpenLibraryBook = BaseBook & {
  title?: string;
};

export type OpenLibraryResponse = {
  docs: OpenLibraryBook[];
  numFound: number;
  start: number;
};

export type BookAuthor = {
  author: {
    key: string;
  };
};

export type BookLanguage = {
  key: string;
};

export type BookDetailsAPI = Partial<{
  title: string;
  description: string | { value: string };
  subjects: string[];
  covers: number[];
  authors: BookAuthor[];
  publishers: string[];
  publish_date: string;
  isbn_10: string[];
  isbn_13: string[];
  number_of_pages: number;
  languages: BookLanguage[];
}>;
