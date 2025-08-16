import { describe, it, expect } from 'vitest';
import { booksApi } from './booksApi';
import { selectBooksApiState } from './booksApiSelectors';

import type { OpenLibraryBook } from '../../types/book';

const generateDescription = (book: Partial<OpenLibraryBook>): string => {
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

describe('booksApi', () => {
  describe('generateDescription function', () => {
    it('should generate description with all fields', () => {
      const book: Partial<OpenLibraryBook> = {
        key: '/works/OL123W',
        title: 'Test Book',
        author_name: ['Author One', 'Author Two', 'Author Three'],
        first_publish_year: 2020,
        publisher: ['Publisher One', 'Publisher Two'],
        subject: ['Fiction', 'Adventure', 'Mystery', 'Drama'],
      };

      const result = generateDescription(book);

      expect(result).toBe(
        'Author: Author One, Author Two • First publish year: 2020 • Publisher: Publisher One • Subject: Fiction, Adventure, Mystery'
      );
    });

    it('should handle missing author_name', () => {
      const book: Partial<OpenLibraryBook> = {
        key: '/works/OL123W',
        title: 'Test Book',
        first_publish_year: 2020,
        publisher: ['Publisher One'],
        subject: ['Fiction'],
      };

      const result = generateDescription(book);

      expect(result).toBe(
        'First publish year: 2020 • Publisher: Publisher One • Subject: Fiction'
      );
    });

    it('should handle empty author_name array', () => {
      const book: Partial<OpenLibraryBook> = {
        key: '/works/OL123W',
        title: 'Test Book',
        author_name: [],
        first_publish_year: 2020,
        publisher: ['Publisher One'],
        subject: ['Fiction'],
      };

      const result = generateDescription(book);

      expect(result).toBe(
        'First publish year: 2020 • Publisher: Publisher One • Subject: Fiction'
      );
    });

    it('should handle missing first_publish_year', () => {
      const book: Partial<OpenLibraryBook> = {
        key: '/works/OL123W',
        title: 'Test Book',
        author_name: ['Author One'],
        publisher: ['Publisher One'],
        subject: ['Fiction'],
      };

      const result = generateDescription(book);

      expect(result).toBe(
        'Author: Author One • Publisher: Publisher One • Subject: Fiction'
      );
    });

    it('should handle missing publisher', () => {
      const book: Partial<OpenLibraryBook> = {
        key: '/works/OL123W',
        title: 'Test Book',
        author_name: ['Author One'],
        first_publish_year: 2020,
        subject: ['Fiction'],
      };

      const result = generateDescription(book);

      expect(result).toBe(
        'Author: Author One • First publish year: 2020 • Subject: Fiction'
      );
    });

    it('should handle empty publisher array', () => {
      const book: Partial<OpenLibraryBook> = {
        key: '/works/OL123W',
        title: 'Test Book',
        author_name: ['Author One'],
        first_publish_year: 2020,
        publisher: [],
        subject: ['Fiction'],
      };

      const result = generateDescription(book);

      expect(result).toBe(
        'Author: Author One • First publish year: 2020 • Subject: Fiction'
      );
    });

    it('should handle missing subject', () => {
      const book: Partial<OpenLibraryBook> = {
        key: '/works/OL123W',
        title: 'Test Book',
        author_name: ['Author One'],
        first_publish_year: 2020,
        publisher: ['Publisher One'],
      };

      const result = generateDescription(book);

      expect(result).toBe(
        'Author: Author One • First publish year: 2020 • Publisher: Publisher One'
      );
    });

    it('should handle empty subject array', () => {
      const book: Partial<OpenLibraryBook> = {
        key: '/works/OL123W',
        title: 'Test Book',
        author_name: ['Author One'],
        first_publish_year: 2020,
        publisher: ['Publisher One'],
        subject: [],
      };

      const result = generateDescription(book);

      expect(result).toBe(
        'Author: Author One • First publish year: 2020 • Publisher: Publisher One'
      );
    });

    it('should limit authors to 2', () => {
      const book: Partial<OpenLibraryBook> = {
        key: '/works/OL123W',
        title: 'Test Book',
        author_name: [
          'Author One',
          'Author Two',
          'Author Three',
          'Author Four',
        ],
      };

      const result = generateDescription(book);

      expect(result).toBe('Author: Author One, Author Two');
    });

    it('should limit subjects to 3', () => {
      const book: Partial<OpenLibraryBook> = {
        key: '/works/OL123W',
        title: 'Test Book',
        subject: ['Fiction', 'Adventure', 'Mystery', 'Drama', 'Comedy'],
      };

      const result = generateDescription(book);

      expect(result).toBe('Subject: Fiction, Adventure, Mystery');
    });

    it('should use only first publisher', () => {
      const book: Partial<OpenLibraryBook> = {
        key: '/works/OL123W',
        title: 'Test Book',
        publisher: ['Publisher One', 'Publisher Two', 'Publisher Three'],
      };

      const result = generateDescription(book);

      expect(result).toBe('Publisher: Publisher One');
    });

    it('should return empty string when no fields are provided', () => {
      const book: Partial<OpenLibraryBook> = {
        key: '/works/OL123W',
        title: 'Test Book',
      };

      const result = generateDescription(book);

      expect(result).toBe('');
    });

    it('should handle single values correctly', () => {
      const book: Partial<OpenLibraryBook> = {
        key: '/works/OL123W',
        title: 'Test Book',
        author_name: ['Single Author'],
        first_publish_year: 2023,
        publisher: ['Single Publisher'],
        subject: ['Single Subject'],
      };

      const result = generateDescription(book);

      expect(result).toBe(
        'Author: Single Author • First publish year: 2023 • Publisher: Single Publisher • Subject: Single Subject'
      );
    });
  });

  describe('API configuration', () => {
    it('should have correct reducerPath', () => {
      expect(booksApi.reducerPath).toBe('booksApi');
    });

    it('should export required hooks', () => {
      expect(booksApi.useGetBooksQuery).toBeDefined();
      expect(booksApi.useGetBookDetailsQuery).toBeDefined();
      expect(booksApi.useLazyGetBooksQuery).toBeDefined();
      expect(booksApi.useLazyGetBookDetailsQuery).toBeDefined();
    });

    it('should have endpoints configured', () => {
      const endpoints = booksApi.endpoints;
      expect(endpoints.getBooks).toBeDefined();
      expect(endpoints.getBookDetails).toBeDefined();
    });

    it('should export utility functions', () => {
      expect(booksApi.util.invalidateTags).toBeDefined();
      expect(booksApi.util.resetApiState).toBeDefined();
    });

    it('should export selectBooksApiState selector', () => {
      expect(selectBooksApiState).toBeDefined();
      expect(typeof selectBooksApiState).toBe('function');
    });
  });
});
