import './BookDetails.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS, API_CONFIG } from '../constants/api';
import Spinner from '../spinner/Spinner';
import { BookDetailsAPI } from '../types/book';
import { BookDetailsProps } from '../types/components';
import { isArrayWithItems } from '../utils/isArrayWithItems';
import { InfoSection } from '../components/InfoSection';

const MAX_SUBJECTS_DISPLAY = 8;
const MAX_PUBLISHERS_DISPLAY = 8;
const MAX_ISBN_DISPLAY = 3;
const MAX_ADD_SUBJECTS_DISPLAY = 8;

function BookDetails({ results }: BookDetailsProps) {
  const { detailsId, page = '1' } = useParams();
  const navigate = useNavigate();

  const [bookDetailsAPI, setBookDetailsAPI] = useState<BookDetailsAPI | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookFromList = results.find((book) => {
    const cleanKey = book.key?.replace('/works/', '');
    return cleanKey === detailsId;
  });

  useEffect(() => {
    if (!detailsId) return;

    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_ENDPOINTS.BOOK_DETAILS}/${detailsId}.json`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch book details: ${response.status}`);
        }

        const data: BookDetailsAPI = await response.json();

        console.log(data);

        setBookDetailsAPI(data);
      } catch (err) {
        setError((err as Error).message);
        console.error('Error fetching book details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [detailsId]);

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
    if (!languages || languages.length === 0) return 'Unknown';
    return languages
      .map((lang) => lang.key.replace('/languages/', '').toUpperCase())
      .slice(0, 3)
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
            {bookFromList.cover_i && (
              <img
                src={getCoverUrl(bookFromList.cover_i)}
                alt={bookFromList.title}
                className="book-cover-large"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}

            <div className="book-main-info">
              <h3>{bookFromList.title}</h3>

              {isArrayWithItems<string>(bookFromList.author_name) && (
                <InfoSection title="Authors:">
                  {bookFromList.author_name.join(', ')}
                </InfoSection>
              )}

              {bookFromList.first_publish_year && (
                <InfoSection title="First Published:">
                  {bookFromList.first_publish_year}
                </InfoSection>
              )}

              {isArrayWithItems<string>(bookFromList.publisher) && (
                <InfoSection title="Publishers:">
                  {bookFromList.publisher
                    .slice(0, MAX_PUBLISHERS_DISPLAY)
                    .join(', ')}
                </InfoSection>
              )}

              {bookFromList.description && (
                <InfoSection title="Generated Description:">
                  {bookFromList.description}
                </InfoSection>
              )}

              {isArrayWithItems<string>(bookFromList.subject) && (
                <InfoSection title="Subjects:">
                  {bookFromList.subject
                    .slice(0, MAX_SUBJECTS_DISPLAY)
                    .join(', ')}
                </InfoSection>
              )}
            </div>

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
