import { useDispatch } from 'react-redux';
import { booksApi } from '../store/api/booksApi';
import { BooksApiTags } from '../store/api/booksApiTags';

export const useCacheInvalidation = () => {
  const dispatch = useDispatch();

  const refreshBooks = () => {
    dispatch(booksApi.util.invalidateTags([BooksApiTags.Books]));
  };

  const refreshBookDetails = (bookId?: string) => {
    if (bookId) {
      dispatch(
        booksApi.util.invalidateTags([
          { type: BooksApiTags.BookDetails, id: bookId },
        ])
      );
    } else {
      dispatch(booksApi.util.invalidateTags([BooksApiTags.BookDetails]));
    }
  };

  const refreshAll = () => {
    dispatch(
      booksApi.util.invalidateTags([
        BooksApiTags.Books,
        BooksApiTags.BookDetails,
      ])
    );
  };

  return {
    refreshBooks,
    refreshBookDetails,
    refreshAll,
  };
};
