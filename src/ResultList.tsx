import React from 'react';

interface Character {
  name: string;
  gender: string;
  birth_year: string;
}

type ResultListState = {
  hasError: boolean;
};

class ResultList extends React.Component<
  { results: Character[] },
  ResultListState
> {
  state: ResultListState = {
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

export default ResultList;
