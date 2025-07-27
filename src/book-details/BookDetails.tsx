import './BookDetails.css';
import { useParams, useNavigate } from 'react-router-dom';
import { Book } from '../app/App';

type BookDetailsProps = {
  results: Book[];
};

function BookDetails({ results }: BookDetailsProps) {
  const { detailsId, page = '1' } = useParams();
  const navigate = useNavigate();

  const bookFromList = results.find((book) => {
    const cleanKey = book.key?.replace('/works/', '');
    return cleanKey === detailsId;
  });

  const handleClose = () => {
    navigate(`/${page}`);
  };

  const getCoverUrl = (coverId: number): string => {
    return `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`;
  };

  if (!detailsId) return null;

  if (!bookFromList) {
    return (
      <div className="book-details-panel">
        <div className="book-details-header">
          <h2>Book Details</h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>
        <div>Book not found in results</div>
      </div>
    );
  }

  return (
    <div className="book-details-panel">
      <div className="book-details-header">
        <h2>Book Details</h2>
        <button className="close-button" onClick={handleClose}>
          ×
        </button>
      </div>

      <div className="book-details-content">
        {bookFromList.cover_i && (
          <img
            src={getCoverUrl(bookFromList.cover_i)}
            alt={bookFromList.title}
            className="book-cover-large"
            style={{ width: '200px', marginBottom: '1rem' }}
          />
        )}

        <div className="book-details-info">
          <h3>{bookFromList.title}</h3>

          {bookFromList.author_name && bookFromList.author_name.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h4>Authors:</h4>
              <p>{bookFromList.author_name.join(', ')}</p>
            </div>
          )}

          {bookFromList.first_publish_year && (
            <div style={{ marginBottom: '1rem' }}>
              <h4>First Published:</h4>
              <p>{bookFromList.first_publish_year}</p>
            </div>
          )}

          {bookFromList.publisher && bookFromList.publisher.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h4>Publishers:</h4>
              <p>{bookFromList.publisher.join(', ')}</p>
            </div>
          )}

          {bookFromList.description && (
            <div style={{ marginBottom: '1rem' }}>
              <h4>Description:</h4>
              <p>{bookFromList.description}</p>
            </div>
          )}

          {bookFromList.subject && bookFromList.subject.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              <h4>Subjects:</h4>
              <p>{bookFromList.subject.slice(0, 8).join(', ')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
