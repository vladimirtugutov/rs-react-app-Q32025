import React from 'react';
import './Spinner.css';

class Spinner extends React.Component<Record<string, never>> {
  render() {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
}

export default Spinner;
