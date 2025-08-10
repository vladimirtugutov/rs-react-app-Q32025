import { useDispatch } from 'react-redux';
import { booksApi } from '../store/api/booksApi';

export const useCacheInvalidation = () => {
  const dispatch = useDispatch();

  const refreshBooks = () => {
    dispatch(booksApi.util.invalidateTags(['Books']));
  };

  const refreshBookDetails = (bookId?: string) => {
    if (bookId) {
      dispatch(
        booksApi.util.invalidateTags([{ type: 'BookDetails', id: bookId }])
      );
    } else {
      dispatch(booksApi.util.invalidateTags(['BookDetails']));
    }
  };

  const refreshAll = () => {
    dispatch(booksApi.util.invalidateTags(['Books', 'BookDetails']));
  };

  return {
    refreshBooks,
    refreshBookDetails,
    refreshAll,
  };
};
