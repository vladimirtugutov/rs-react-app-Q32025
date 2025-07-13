import React from 'react';

type Pokemon = {
  name: string;
  sprites?: {
    front_default: string;
  };
  description?: string;
  url?: string;
};

type ResultsProps = {
  results: Pokemon[];
  error: string | null;
};

class Results extends React.Component<ResultsProps> {
  render() {
    const { results, error } = this.props;

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (!results || results.length === 0) {
      return <div className="no-results">No results found.</div>;
    }

    return (
      <div className="results-table">
        {results.map((item, index) => (
          <div
            key={index}
            style={{
              padding: '1rem',
              borderBottom: '1px solid #ccc',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            {item.sprites?.front_default && (
              <img
                src={item.sprites.front_default}
                alt={item.name}
                width={80}
                height={80}
                style={{ imageRendering: 'pixelated' }}
              />
            )}
            <div style={{ textAlign: 'left' }}>
              <h3 style={{ margin: '0 0 0.5rem' }}>{item.name}</h3>
              {item.description && (
                <p style={{ margin: 0, fontStyle: 'italic', color: '#555' }}>
                  {item.description}
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
