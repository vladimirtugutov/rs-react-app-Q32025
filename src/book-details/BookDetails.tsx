import './BookDetails.css';
import { useParams, useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../constants/api';
import Spinner from '../spinner/Spinner';
import { BookDetailsProps } from '../types/components';
import { useBookDetails } from '../hooks/useBookDetails';
import { BookMainInfo } from '../components/BookMainInfo';
import { BookAdditionalInfo } from '../components/BookAdditionalInfo';
import { getDescription } from '../utils/getDescription';
import { formatLanguages } from '../utils/formatLanguages';

export const BookDetails = ({ results }: BookDetailsProps) => {
  const { detailsId, page = '1' } = useParams();
  const navigate = useNavigate();

  const { bookDetailsAPI, loading, error } = useBookDetails(detailsId);

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
      <div className="book-details-panel">
        <div className="book-details-header">
          <h2 className="book-details-title">Book Details</h2>
          <button
            className="close-button"
            onClick={handleClose}
            title="Close details"
          >
            ×
          </button>
        </div>
        <div className="book-not-found">
          <p>Book not found in current search results</p>
          <p>Try searching for this book again</p>
        </div>
      </div>
    );
  }

  return (
    <div className="book-details-panel">
      <div className="book-details-header">
        <h2>Book Details</h2>
        <button
          className="close-button"
          onClick={handleClose}
          title="Close details"
        >
          ×
        </button>
      </div>

      <div className="book-details-content">
        {loading && (
          <div className="loading-section-top">
            <Spinner />
            <p>Loading detailed information...</p>
          </div>
        )}

        {!loading && (
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
