import React from 'react';
import './spinner.css';

export class Spinner extends React.Component {
  render() {
    return (
      <div className="spinner-container" role="status" aria-busy="true">
        <div className="spinner"></div>
      </div>
    );
  }
}
