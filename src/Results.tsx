import React from 'react';

interface Character {
  name: string;
  gender: string;
  birth_year: string;
}

class Results extends React.Component<{
  results: Character[];
  error: string | null;
}> {
  render() {
    return (
      <table className="results-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Item Description</th>
          </tr>
        </thead>
        <tbody>
          {this.props.error ? (
            <tr>
              <td colSpan={2} className="error-message">
                {this.props.error}
              </td>
            </tr>
          ) : this.props.results.length === 0 ? (
            <tr>
              <td colSpan={2} className="no-results">
                No results found
              </td>
            </tr>
          ) : (
            this.props.results.map((item) => (
              <tr key={item.name}>
                <td>{item.name}</td>
                <td>
                  {item.gender}, {item.birth_year}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    );
  }
}

export default Results;
