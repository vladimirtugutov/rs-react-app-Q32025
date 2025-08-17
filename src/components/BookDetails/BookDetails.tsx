'use client';
import './BookDetails.css';
import { useRouter, useParams } from 'next/navigation';
import { API_CONFIG } from '../../constants/api';
import Spinner from '../Spinner/Spinner';
import { useBookDetails } from '../../hooks/useBookDetails';
import { BookMainInfo } from '../BookMainInfo';
import { BookAdditionalInfo } from '../BookAdditionalInfo';
import { getDescription } from '../../utils/getDescription';
import { formatLanguages } from '../../utils/formatLanguages';
import { Book } from '../../types/book';

export const BookDetails = () => {
  const router = useRouter();
  const params = useParams() as { locale: string; page: string; id: string };

  const { bookDetailsAPI, isLoading, error } = useBookDetails(params.id);

  const handleClose = () => {
    router.back();
  };

  const getCoverUrl = (coverId: number) =>
    `${API_CONFIG.COVER_BASE_URL}/${coverId}-L.jpg`;

  if (!params.id) return null;

  if (error) {
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

  const bookForMainInfo: Book | null = bookDetailsAPI
    ? {
        key: `/works/${params.id}`,
        title: bookDetailsAPI.title || 'Untitled Book',
        author_name: Array.isArray(bookDetailsAPI.authors)
          ? bookDetailsAPI.authors.map((a): string => {
              if (typeof a === 'object' && a !== null && 'name' in a) {
                return (a as { name: string }).name;
              }
              return '';
            })
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
      }
    : null;

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
        {isLoading && (
          <div className="loading-section-top" data-testid="loading-section">
            <Spinner />
            <p>Loading detailed information...</p>
          </div>
        )}

        {!isLoading && bookForMainInfo && (
          <>
            <BookMainInfo book={bookForMainInfo} getCoverUrl={getCoverUrl} />

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

export default BookDetails;
