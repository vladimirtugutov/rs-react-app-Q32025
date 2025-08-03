import './Spinner.css';

function Spinner() {
  return (
    <div className="spinner-container" role="status" aria-busy="true">
      <div className="spinner"></div>
    </div>
  );
}

export default Spinner;
