import React from "react";
import "./Spinner.css";

class Spinner extends React.Component {
  render() {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }
}

export default Spinner;
