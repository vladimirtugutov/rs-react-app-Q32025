import React from 'react';

interface Character {
  name: string;
  gender: string;
  birth_year: string;
}

type ResultsState = {
  hasError: boolean;
};

class Results extends React.Component<
  { results: Character[] },
  ResultsState
> {
  state: ResultsState = {
    hasError: false,
  };

  handleClick = () => {
    this.setState({ hasError: true });
  };

  render() {
    if (this.state.hasError) {
      throw new Error('Simulated error by button click.');
    }
    return (
      <div>
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
        <button onClick={this.handleClick}>Error button</button>
      </div>
    );
  }
}

export default Results;
