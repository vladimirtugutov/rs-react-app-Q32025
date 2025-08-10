import { useGetBooksQuery } from '../store/api/booksApi';
import type { Book } from '../types/book';

type UseBooksParams = {
  searchTerm?: string;
  page: number;
  enabled?: boolean;
};

type UseBooksReturn = {
  books: Book[];
  totalResults: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
};

export const useBooks = ({
  searchTerm = '',
  page,
  enabled = true,
}: UseBooksParams): UseBooksReturn => {
  const {
    data,
    isLoading,
    error: queryError,
    refetch,
  } = useGetBooksQuery({ searchTerm, page }, { skip: !enabled });

  return {
    books: data?.books || [],
    totalResults: data?.totalResults || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    error: queryError ? 'Failed to fetch books' : null,
    refetch,
  };
};
