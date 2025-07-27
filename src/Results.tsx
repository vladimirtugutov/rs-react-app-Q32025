import React from 'react';

type Book = {
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  isbn?: string[];
  subject?: string[];
  publisher?: string[];
  description?: string;
  key?: string;
};

type ResultsProps = {
  results: Book[];
  error: string | null;
};

class Results extends React.Component<ResultsProps> {
  getCoverUrl = (coverId: number | undefined): string | null => {
    if (!coverId) return null;
    return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;
  };

  render() {
    const { results, error } = this.props;

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
            }}
          >
            {book.cover_i && (
              <img
                src={this.getCoverUrl(book.cover_i) ?? undefined}
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
}

export default Results;
