import './BookDetails.css';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { API_CONFIG } from '../constants/api';
import Spinner from '../spinner/Spinner';
import { useBookDetails } from '../hooks/useBookDetails';
import { BookMainInfo } from '../components/BookMainInfo';
import { BookAdditionalInfo } from '../components/BookAdditionalInfo';
import { getDescription } from '../utils/getDescription';
import { formatLanguages } from '../utils/formatLanguages';
import { Book } from '../types/book';

type OutletContext = {
  results: Book[];
};

export const BookDetails = () => {
  const { detailsId, page = '1' } = useParams();
  const navigate = useNavigate();
  const context = useOutletContext<OutletContext | null>();
  const results = context?.results ?? [];

  const { bookDetailsAPI, isLoading, error } = useBookDetails(detailsId);

  const bookFromList = results.find((book) => {
    const cleanKey = book.key?.replace('/works/', '');
    return cleanKey === detailsId;
  });

  const handleClose = () => {
    navigate(`/${page}`);
  };

  const getCoverUrl = (coverId: number) =>
    `${API_CONFIG.COVER_BASE_URL}/${coverId}-L.jpg`;

  if (!detailsId) return null;

  if (!bookFromList) {
    return (
      <div className="book-details-panel" data-testid="book-details-panel">
        <div className="book-details-header" data-testid="book-details-header">
          <h2 className="book-details-title" data-testid="book-details-title">
            Book Details
          </h2>
          <button
            className="close-button"
            data-testid="close-button"
            onClick={handleClose}
            title="Close details"
          >
            ×
          </button>
        </div>
        <div className="book-not-found" data-testid="book-not-found">
          <p>Book not found in current search results</p>
          <p>Try searching for this book again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="book-details-panel" data-testid="book-details-panel">
      <div className="book-details-header" data-testid="book-details-header">
        <h2>Book Details</h2>
        <button
          className="close-button"
          data-testid="close-button"
          onClick={handleClose}
          title="Close details"
        >
          ×
        </button>
      </div>

      <div className="book-details-content">
        {isLoading && (
          <div className="loading-section-top" data-testid="loading-section">
            <Spinner />
            <p>Loading detailed information...</p>
          </div>
        )}

        {!isLoading && (
          <>
            <BookMainInfo book={bookFromList} getCoverUrl={getCoverUrl} />

            <div className="book-additional-info">
              <h4>Additional Information:</h4>

              <BookAdditionalInfo
                data={bookDetailsAPI}
                error={error}
                getDescription={getDescription}
                formatLanguages={formatLanguages}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
