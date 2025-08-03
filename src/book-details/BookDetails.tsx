import './BookDetails.css';
import { useParams, useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../constants/api';
import Spinner from '../spinner/Spinner';
import { BookDetailsProps } from '../types/components';
import { isArrayWithItems } from '../utils/isArrayWithItems';
import { InfoSection } from '../components/InfoSection';
import { useBookDetails } from '../hooks/useBookDetails';
import { BookMainInfo } from '../components/BookMainInfo';

const MAX_ISBN_DISPLAY = 3;
const MAX_ADD_SUBJECTS_DISPLAY = 8;
const MAX_LANG = 3;

function BookDetails({ results }: BookDetailsProps) {
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

  const getCoverUrl = (coverId: number) => {
    return `${API_CONFIG.COVER_BASE_URL}/${coverId}-L.jpg`;
  };

  const getDescription = (
    description: string | { value: string } | undefined
  ): string => {
    if (!description) return '';
    if (typeof description === 'string') return description;
    return description.value || '';
  };

  const formatLanguages = (languages?: Array<{ key: string }>): string => {
    if (!isArrayWithItems(languages)) return 'Unknown';
    return languages
      .map((lang) => lang.key.replace('/languages/', '').toUpperCase())
      .slice(0, MAX_LANG)
      .join(', ');
  };

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

              {error && (
                <div className="error-section">
                  <p className="error-message">
                    Error loading additional details: {error}
                  </p>
                </div>
              )}

              {bookDetailsAPI && (
                <div className="api-details">
                  {getDescription(bookDetailsAPI.description) && (
                    <InfoSection title="Full Description:">
                      <div className="description-content">
                        <p>{getDescription(bookDetailsAPI.description)}</p>
                      </div>
                    </InfoSection>
                  )}

                  {bookDetailsAPI.number_of_pages && (
                    <InfoSection title="Pages:">
                      <p>{bookDetailsAPI.number_of_pages}</p>
                    </InfoSection>
                  )}

                  {isArrayWithItems<string>(bookDetailsAPI.languages) && (
                    <InfoSection title="Languages:">
                      <p>{formatLanguages(bookDetailsAPI.languages)}</p>
                    </InfoSection>
                  )}

                  {(bookDetailsAPI.isbn_10 || bookDetailsAPI.isbn_13) && (
                    <InfoSection title="ISBN:">
                      <div className="isbn-list">
                        {bookDetailsAPI.isbn_10 && (
                          <p>
                            <strong>ISBN-10:</strong>{' '}
                            {bookDetailsAPI.isbn_10
                              .slice(0, MAX_ISBN_DISPLAY)
                              .join(', ')}
                          </p>
                        )}
                        {bookDetailsAPI.isbn_13 && (
                          <p>
                            <strong>ISBN-13:</strong>{' '}
                            {bookDetailsAPI.isbn_13
                              .slice(0, MAX_ISBN_DISPLAY)
                              .join(', ')}
                          </p>
                        )}
                      </div>
                    </InfoSection>
                  )}

                  {isArrayWithItems<string>(bookDetailsAPI.subjects) && (
                    <InfoSection title="Additional Subjects:">
                      <p>
                        {bookDetailsAPI.subjects
                          .slice(0, MAX_ADD_SUBJECTS_DISPLAY)
                          .join(', ')}
                      </p>
                    </InfoSection>
                  )}

                  {bookDetailsAPI.publish_date && (
                    <InfoSection title="Publish Date:">
                      <p>{bookDetailsAPI.publish_date}</p>
                    </InfoSection>
                  )}
                </div>
              )}

              {bookDetailsAPI &&
                !error &&
                !getDescription(bookDetailsAPI.description) &&
                !bookDetailsAPI.number_of_pages && (
                  <div className="no-additional-info">
                    <p>No additional information available from the API</p>
                  </div>
                )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default BookDetails;
