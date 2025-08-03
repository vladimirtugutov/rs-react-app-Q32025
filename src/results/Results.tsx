import './results.css';
import { useParams, useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../constants/api';
import { Book } from '../types/book';
import { ResultsProps } from '../types/components';

export const Results = ({ results, error }: ResultsProps) => {
  const { detailsId, page = '1' } = useParams();
  const navigate = useNavigate();

  const getCoverUrl = (coverId: number | undefined): string | null => {
    if (!coverId) return null;
    return `${API_CONFIG.COVER_BASE_URL}/${coverId}-M.jpg`;
  };

  const handleBookClick = (book: Book) => {
    if (!book.key) return;

    const bookId = book.key.replace('/works/', '');
    navigate(`/${page}/${bookId}`);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!results || results.length === 0) {
    return <div className="no-results">Нет результатов.</div>;
  }

  return (
    <div className="results-table">
      {results.map((book, index) => (
        <div
          key={book.key || index}
          className={`result-card ${
            detailsId === book.key?.replace('/works/', '') ? 'selected' : ''
          }`}
          onClick={() => handleBookClick(book)}
        >
          {book.cover_i && (
            <img
              src={getCoverUrl(book.cover_i) ?? undefined}
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
      ))}
    </div>
  );
};
