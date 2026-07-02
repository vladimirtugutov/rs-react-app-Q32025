'use client';
import './BookDetails.css';
import { API_CONFIG } from '../../constants/api';
import { BookMainInfo } from '../BookMainInfo';
import { BookAdditionalInfo } from '../BookAdditionalInfo';
import { getDescription } from '../../utils/getDescription';
import { formatLanguages } from '../../utils/formatLanguages';
import { Book, BookDetailsAPI } from '../../types/book';

type BookDetailsProps = {
  bookId: string;
  bookDetailsAPI: BookDetailsAPI | null;
};

const handleClose = () => window.history.back();

const getCoverUrl = (coverId: number) =>
  `${API_CONFIG.COVER_BASE_URL}/${coverId}-L.jpg`;

export const BookDetails = ({ bookId, bookDetailsAPI }: BookDetailsProps) => {
  if (!bookDetailsAPI) {
    return (
      <div className="book-details-panel" data-testid="book-details-panel">
        <div className="book-details-header" data-testid="book-details-header">
          <h2 className="book-details-title" data-testid="book-details-title">
            Book Details
          </h2>
          <button
            className="close-button"
            onClick={handleClose}
            title="Close details"
            data-testid="close-button"
          >
            ×
          </button>
        </div>
        <div className="book-not-found" data-testid="book-not-found">
          <p>Book not found</p>
          <p>Try searching for this book again</p>
        </div>
      </div>
    );
  }

  const bookForMainInfo: Book = {
    key: `/works/${bookId}`,
    title: bookDetailsAPI.title || 'Untitled Book',
    author_name: Array.isArray(bookDetailsAPI.authors)
      ? bookDetailsAPI.authors.map((a) =>
          typeof a === 'object' && a !== null && 'name' in a
            ? (a as { name: string }).name
            : ''
        )
      : [],
    first_publish_year: bookDetailsAPI.publish_date
      ? new Date(bookDetailsAPI.publish_date).getFullYear()
      : undefined,
    cover_i: bookDetailsAPI.covers?.[0],
    description:
      typeof bookDetailsAPI.description === 'string'
        ? bookDetailsAPI.description
        : bookDetailsAPI.description?.value || undefined,
    subject: bookDetailsAPI.subjects || [],
  };

  return (
    <div className="book-details-panel" data-testid="book-details-panel">
      <div className="book-details-header" data-testid="book-details-header">
        <h2>Book Details</h2>
        <button
          className="close-button"
          onClick={handleClose}
          title="Close details"
          data-testid="close-button"
        >
          ×
        </button>
      </div>
      <div className="book-details-content">
        <BookMainInfo book={bookForMainInfo} getCoverUrl={getCoverUrl} />
        <div className="book-additional-info">
          <h4>Additional Information:</h4>
          <BookAdditionalInfo
            data={bookDetailsAPI}
            error={null}
            getDescription={getDescription}
            formatLanguages={formatLanguages}
          />
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
