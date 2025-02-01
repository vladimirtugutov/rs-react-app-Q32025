import React from 'react';

interface Character {
  name: string;
  gender: string;
  birth_year: string;
}

class Results extends React.Component<{ results: Character[] }> {
  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Item Description</th>
          </tr>
        </thead>
        <tbody>
          {this.props.results.map((item) => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td>
                {item.gender}, {item.birth_year}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default Results;
