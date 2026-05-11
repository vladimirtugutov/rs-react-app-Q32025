import React from 'react';
import { Pokemon } from '../../types';
import { Card } from '../card/card';
import { hasItems } from '../../utils/array-utils';

type ResultsProps = {
  results: Pokemon[];
  error: string | null;
};

export class Results extends React.Component<ResultsProps> {
  render() {
    const { results, error } = this.props;

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (!hasItems(results)) {
      return <div className="no-results">No results found.</div>;
    }

    return (
      <div className="results-table">
        {results.map((item) => (
          <Card key={item.name} pokemon={item} />
        ))}
      </div>
    );
  }
}
