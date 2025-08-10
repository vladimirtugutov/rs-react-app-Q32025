import { useGetBookDetailsQuery } from '../store/api/booksApi';

export const useBookDetails = (detailsId?: string | null) => {
  const {
    data: bookDetailsAPI,
    isLoading,
    error: queryError,
  } = useGetBookDetailsQuery(detailsId || '', {
    skip: !detailsId,
  });

  const error = queryError
    ? `Failed to fetch book details: ${(queryError as { status?: number }).status || 'Unknown error'}`
    : null;

  return {
    bookDetailsAPI: bookDetailsAPI || null,
    isLoading,
    error,
  };
};
