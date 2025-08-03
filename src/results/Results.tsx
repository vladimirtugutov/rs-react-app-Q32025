import './Results.css';
import { useParams, useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../constants/api';
import { Book } from '../types/book';
import { ResultsProps } from '../types/components';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { toggleItem, selectSelectedItems } from '../store/selectedItemsSlice';

export const Results = ({ results, error }: ResultsProps) => {
  const { detailsId, page = '1' } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const selectedItems = useAppSelector(selectSelectedItems);

  const getCoverUrl = (coverId: number | undefined): string | undefined => {
    if (!coverId) return undefined;
    return `${API_CONFIG.COVER_BASE_URL}/${coverId}-M.jpg`;
  };

  const handleBookClick = (book: Book) => {
    if (!book.key) return;

    const bookId = book.key.replace('/works/', '');
    navigate(`/${page}/${bookId}`);
  };

  const handleCheckboxChange = (book: Book, event: React.MouseEvent) => {
    event.stopPropagation();

    if (!book.key) return;

    const selectedItem = {
      id: book.key.replace('/works/', ''),
      title: book.title,
      authors: book.author_name,
      description: book.description || 'No description available',
      publishedDate: book.first_publish_year?.toString(),
      pageCount: undefined,
      categories: book.subject,
      thumbnail: getCoverUrl(book.cover_i),
      previewLink: `https://openlibrary.org${book.key}`,
    };

    dispatch(toggleItem(selectedItem));
  };

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
      {results.map((book, index) => {
        const bookId = book.key?.replace('/works/', '') || '';
        const isSelected = isItemSelected(bookId);

        return (
          <div
            key={book.key || index}
            className={`result-card ${
              detailsId === bookId ? 'selected' : ''
            } ${isSelected ? 'checked' : ''}`}
            onClick={() => handleBookClick(book)}
          >
            <div
              className="book-checkbox-container"
              onClick={(e) => handleCheckboxChange(book, e)}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                className="book-checkbox"
                aria-label={`Select ${book.title}`}
              />
            </div>

            {book.cover_i && (
              <img
                src={getCoverUrl(book.cover_i)}
                alt={book.title}
                className="book-cover-small"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div className="book-info-minimal">
              <h3 className="book-title">{book.title}</h3>
              {book.author_name && book.author_name.length > 0 && (
                <p className="book-author">
                  by {book.author_name.slice(0, 2).join(', ')}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
