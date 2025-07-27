import { useParams, useNavigate } from 'react-router-dom';
import { Book } from '../app/App';

type ResultsProps = {
  results: Book[];
  error: string | null;
};

function Results({ results, error }: ResultsProps) {
  const { detailsId } = useParams();
  const navigate = useNavigate();

  const getCoverUrl = (coverId: number | undefined): string | null => {
    if (!coverId) return null;
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  };

  const handleBookClick = (book: Book) => {
    if (!book.key) return;

    const bookId = book.key.replace('/works/', '');
    const currentPath = window.location.pathname;
    const page = currentPath.split('/')[1] || '1';

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
          style={{
            padding: '1rem',
            borderBottom: '1px solid #ccc',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            cursor: 'pointer',
            backgroundColor:
              detailsId === book.key?.replace('/works/', '')
                ? '#f0f0f0'
                : 'transparent',
          }}
          onClick={() => handleBookClick(book)}
        >
          {book.cover_i && (
            <img
              src={getCoverUrl(book.cover_i) ?? undefined}
              alt={book.title}
              width={80}
              height={120}
              style={{ objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ margin: '0 0 0.5rem' }}>{book.title}</h3>
            {book.description && (
              <p style={{ margin: 0, fontStyle: 'italic', color: '#555' }}>
                {book.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Results;
