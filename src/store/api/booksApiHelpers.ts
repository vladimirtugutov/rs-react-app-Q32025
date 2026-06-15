import { OpenLibraryBook } from '../../types/book';

export const getBooksQueryUrl = (
  searchTerm: string,
  page: number,
  itemsPerPage: number
) => {
  const offset = (page - 1) * itemsPerPage;
  if (searchTerm.trim()) {
    return `?title=${encodeURIComponent(searchTerm.trim())}&limit=${itemsPerPage}&offset=${offset}&fields=key,title,author_name,cover_i,first_publish_year,publisher,subject&sort=rating`;
  }
  return `?q=books&limit=${itemsPerPage}&offset=${offset}&fields=key,title,author_name,cover_i,first_publish_year,publisher,subject&sort=rating`;
};

export const generateDescription = (book: OpenLibraryBook): string => {
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
