import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearHighlight, clearFormData } from '../store/formSlice';

export default function MainRoute() {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.form.formData);
  const highlightedId = useSelector(
    (state: RootState) => state.form.highlightedId
  );

  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => {
        dispatch(clearHighlight());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [highlightedId, dispatch]);

  return (
    <div>
      <h1>Main Page</h1>
      <p>Here you can see submitted forms:</p>

      {formData.length > 0 && (
        <button
          onClick={() => dispatch(clearFormData())}
          className="clear-button"
        >
          Clear All Data
        </button>
      )}

      <div className="cards">
        {formData.length > 0 ? (
          formData.map((data) => (
            <div
              key={data.id}
              className={`card ${data.id === highlightedId ? 'highlighted' : ''}`}
            >
              <p>
                <strong>Name:</strong> {data.name}
              </p>
              <p>
                <strong>Age:</strong> {data.age}
              </p>
              <p>
                <strong>Email:</strong> {data.email}
              </p>
              <p>
                <strong>Gender:</strong> {data.gender}
              </p>
              <p>
                <strong>Country:</strong> {data.country}
              </p>
              {data.imageBase64 && (
                <img src={data.imageBase64} alt="Uploaded" />
              )}
            </div>
          ))
        ) : (
          <p>No submitted forms yet.</p>
        )}
      </div>

      <style>
        {`
          .cards {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
          }
          .card {
            border: 1px solid black;
            padding: 10px;
            transition: background-color 0.5s ease-in-out;
          }
          .highlighted {
            border: 2px solid red;
            background-color: #ffe6e6;
          }
          .clear-button {
            margin-bottom: 10px;
            padding: 8px;
            background-color: red;
            color: white;
            border: none;
            cursor: pointer;
          }
          .clear-button:hover {
            background-color: darkred;
          }
        `}
      </style>
    </div>
  );
}
