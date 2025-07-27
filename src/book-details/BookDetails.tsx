import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../spinner/Spinner';

type BookDetails = {
  title?: string;
  description?: string | { value: string };
  authors?: Array<{ author: { key: string } }>;
  subjects?: string[];
  publish_date?: string;
  publishers?: string[];
  covers?: number[];
};

function BookDetails() {
  const { detailsId, page = '1' } = useParams();
  const navigate = useNavigate();
  const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!detailsId) return;

    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://openlibrary.org/works/${detailsId}.json`
        );
        await new Promise((r) => setTimeout(r, 300));

        if (!response.ok) {
          throw new Error(`Failed to fetch book details: ${response.status}`);
        }

        const data = await response.json();
        setBookDetails(data);
      } catch (err) {
        setError((err as Error).message);
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
    return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  };

  const getDescription = (
    description: string | { value: string } | undefined
  ): string => {
    if (!description) return 'Описание недоступно';
    if (typeof description === 'string') return description;
    return description.value || 'Описание недоступно';
  };

  if (!detailsId) return null;

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
        {loading && <Spinner />}

        {error && (
          <div className="error-message">
            Error loading book details: {error}
          </div>
        )}

        {bookDetails && !loading && (
          <div className="book-details-info">
            {bookDetails.covers && bookDetails.covers[0] && (
              <img
                src={getCoverUrl(bookDetails.covers[0])}
                alt={bookDetails.title}
                className="book-cover-large"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            )}

            <h3>{bookDetails.title}</h3>

            <div className="book-description">
              <h4>Description:</h4>
              <p>{getDescription(bookDetails.description)}</p>
            </div>

            {bookDetails.subjects && bookDetails.subjects.length > 0 && (
              <div className="book-subjects">
                <h4>Subjects:</h4>
                <p>{bookDetails.subjects.slice(0, 5).join(', ')}</p>
              </div>
            )}

            {bookDetails.publish_date && (
              <div className="book-publish-date">
                <h4>Publish Date:</h4>
                <p>{bookDetails.publish_date}</p>
              </div>
            )}

            {bookDetails.publishers && bookDetails.publishers.length > 0 && (
              <div className="book-publishers">
                <h4>Publishers:</h4>
                <p>{bookDetails.publishers.join(', ')}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default BookDetails;
