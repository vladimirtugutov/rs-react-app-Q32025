import './BookDetails.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Book } from '../app/App';
import { API_ENDPOINTS, API_CONFIG } from '../constants/api';
import Spinner from '../spinner/Spinner';

type BookDetailsProps = {
  results: Book[];
};

type BookDetailsAPI = {
  title?: string;
  description?: string | { value: string };
  subjects?: string[];
  covers?: number[];
  authors?: Array<{
    author: {
      key: string;
    };
  }>;
  publishers?: string[];
  publish_date?: string;
  isbn_10?: string[];
  isbn_13?: string[];
  number_of_pages?: number;
  languages?: Array<{
    key: string;
  }>;
};

function BookDetails({ results }: BookDetailsProps) {
  const { detailsId, page = '1' } = useParams();
  const navigate = useNavigate();

  // Состояния для дополнительного API запроса
  const [bookDetailsAPI, setBookDetailsAPI] = useState<BookDetailsAPI | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Находим книгу из основного списка
  const bookFromList = results.find((book) => {
    const cleanKey = book.key?.replace('/works/', '');
    return cleanKey === detailsId;
  });

  // Дополнительный API запрос для получения детальной информации
  useEffect(() => {
    if (!detailsId) return;

    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);

      const startTime = Date.now();

      try {
        const response = await fetch(
          `${API_ENDPOINTS.BOOK_DETAILS}/${detailsId}.json`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch book details: ${response.status}`);
        }

        const data: BookDetailsAPI = await response.json();

        // Гарантируем минимум 1.5 секунды показа лоадера
        const elapsedTime = Date.now() - startTime;
        const minLoadingTime = 1500;

        if (elapsedTime < minLoadingTime) {
          await new Promise((resolve) =>
            setTimeout(resolve, minLoadingTime - elapsedTime)
          );
        }

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

  const getCoverUrl = (coverId: number): string => {
    return `${API_CONFIG.COVER_BASE_URL}/${coverId}-L.jpg`;
  };

  const getDescription = (
    description: string | { value: string } | undefined
  ): string => {
    if (!description) return '';
    if (typeof description === 'string') return description;
    return description.value || '';
  };

  const formatLanguages = (
    languages: Array<{ key: string }> | undefined
  ): string => {
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
          <h2>Book Details</h2>
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
        {/* ЛОАДЕР НАВЕРХУ - показывается во время загрузки */}
        {loading && (
          <div className="loading-section-top">
            <Spinner />
            <p>Loading detailed information...</p>
          </div>
        )}

        {/* Контент показывается только когда НЕ загружается */}
        {!loading && (
          <>
            {/* Обложка книги */}
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

            {/* Основная информация из списка результатов */}
            <div className="book-main-info">
              <h3>{bookFromList.title}</h3>

              {bookFromList.author_name &&
                bookFromList.author_name.length > 0 && (
                  <div className="info-section">
                    <h4>Authors:</h4>
                    <p>{bookFromList.author_name.join(', ')}</p>
                  </div>
                )}

              {bookFromList.first_publish_year && (
                <div className="info-section">
                  <h4>First Published:</h4>
                  <p>{bookFromList.first_publish_year}</p>
                </div>
              )}

              {bookFromList.publisher && bookFromList.publisher.length > 0 && (
                <div className="info-section">
                  <h4>Publishers:</h4>
                  <p>{bookFromList.publisher.join(', ')}</p>
                </div>
              )}

              {bookFromList.description && (
                <div className="info-section">
                  <h4>Generated Description:</h4>
                  <p>{bookFromList.description}</p>
                </div>
              )}

              {bookFromList.subject && bookFromList.subject.length > 0 && (
                <div className="info-section">
                  <h4>Subjects:</h4>
                  <p>{bookFromList.subject.slice(0, 8).join(', ')}</p>
                </div>
              )}
            </div>

            {/* Дополнительная информация из API */}
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
                  {/* Полное описание */}
                  {getDescription(bookDetailsAPI.description) && (
                    <div className="info-section">
                      <h4>Full Description:</h4>
                      <div className="description-content">
                        <p>{getDescription(bookDetailsAPI.description)}</p>
                      </div>
                    </div>
                  )}

                  {/* Количество страниц */}
                  {bookDetailsAPI.number_of_pages && (
                    <div className="info-section">
                      <h4>Pages:</h4>
                      <p>{bookDetailsAPI.number_of_pages}</p>
                    </div>
                  )}

                  {/* Языки */}
                  {bookDetailsAPI.languages &&
                    bookDetailsAPI.languages.length > 0 && (
                      <div className="info-section">
                        <h4>Languages:</h4>
                        <p>{formatLanguages(bookDetailsAPI.languages)}</p>
                      </div>
                    )}

                  {/* ISBN */}
                  {(bookDetailsAPI.isbn_10 || bookDetailsAPI.isbn_13) && (
                    <div className="info-section">
                      <h4>ISBN:</h4>
                      <div className="isbn-list">
                        {bookDetailsAPI.isbn_10 && (
                          <p>
                            <strong>ISBN-10:</strong>{' '}
                            {bookDetailsAPI.isbn_10.slice(0, 3).join(', ')}
                          </p>
                        )}
                        {bookDetailsAPI.isbn_13 && (
                          <p>
                            <strong>ISBN-13:</strong>{' '}
                            {bookDetailsAPI.isbn_13.slice(0, 3).join(', ')}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Дополнительные темы из API */}
                  {bookDetailsAPI.subjects &&
                    bookDetailsAPI.subjects.length > 0 && (
                      <div className="info-section">
                        <h4>Additional Subjects:</h4>
                        <p>{bookDetailsAPI.subjects.slice(0, 10).join(', ')}</p>
                      </div>
                    )}

                  {/* Дата публикации */}
                  {bookDetailsAPI.publish_date && (
                    <div className="info-section">
                      <h4>Publish Date:</h4>
                      <p>{bookDetailsAPI.publish_date}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Если API не вернул дополнительных данных */}
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
