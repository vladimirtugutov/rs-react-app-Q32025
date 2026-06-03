import './Results.css';
import { useParams } from 'react-router-dom';
import { ResultsProps } from '../../types/components';
import { useAppSelector } from '../../store/hooks';
import { selectSelectedItems } from '../../store/selectedItemsSlice';
import { BookItem } from '../../components/BookItem';

export const Results = ({ results, error }: ResultsProps) => {
  const { detailsId } = useParams();
  const selectedItems = useAppSelector(selectSelectedItems);

  const isItemSelected = (bookId: string): boolean => {
    return selectedItems.some((item) => item.id === bookId);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!results || results.length === 0) {
    return <div className="no-results">No results</div>;
  }

  return (
    <div className="results-table">
      {results.map((book) => {
        const bookId = book.key?.replace('/works/', '') || '';
        const isDetailSelected = detailsId === bookId;

        return (
          <BookItem
            key={book.key || `book-${bookId}`}
            book={book}
            isSelected={isItemSelected(bookId)}
            isDetailSelected={isDetailSelected}
          />
        );
      })}
    </div>
  );
};
