import React from 'react';
import './Spinner.css';

class Spinner extends React.Component<Record<string, never>> {
  render() {
    return (
      <div className="spinner-container" role="status" aria-busy="true">
        <div className="spinner"></div>
      </div>
    );
  }
}

export default Spinner;
