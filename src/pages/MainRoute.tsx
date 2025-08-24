import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { clearHighlight, clearFormData } from '../store/formSlice';
import { compressImage } from '../utils/imageUtils';
import './MainRoute.css';

type MainRouteProps = {
  onOpenUncontrolled: () => void;
  onOpenControlled: () => void;
};

export default function MainRoute({
  onOpenUncontrolled,
  onOpenControlled,
}: MainRouteProps) {
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.form.formData);
  const highlightedId = useSelector(
    (state: RootState) => state.form.highlightedId
  );

  const [compressedImages, setCompressedImages] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (highlightedId) {
      const timer = setTimeout(() => {
        dispatch(clearHighlight());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [highlightedId, dispatch]);

  useEffect(() => {
    const compressImages = async () => {
      const newCompressedImages: Record<string, string> = {};

      for (const data of formData) {
        if (data.imageBase64 && !compressedImages[data.id]) {
          try {
            const compressed = await compressImage(data.imageBase64, 200, 0.6);
            newCompressedImages[data.id] = compressed;
          } catch (error) {
            console.error('Failed to compress image:', error);
            newCompressedImages[data.id] = data.imageBase64;
          }
        }
      }

      if (Object.keys(newCompressedImages).length > 0) {
        setCompressedImages((prev) => ({ ...prev, ...newCompressedImages }));
      }
    };

    compressImages();
  }, [formData, compressedImages]);

  return (
    <div className="main-route">
      <h1>Main Page</h1>

      <div className="action-buttons">
        <button
          onClick={onOpenUncontrolled}
          className="open-form-button uncontrolled"
        >
          Open Uncontrolled Form
        </button>
        <button
          onClick={onOpenControlled}
          className="open-form-button controlled"
        >
          Open Controlled Form
        </button>
      </div>

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
                <div className="image-container">
                  <img
                    src={compressedImages[data.id] || data.imageBase64}
                    alt="User upload"
                    className="uploaded-image"
                  />
                  {!compressedImages[data.id] && (
                    <div className="compression-loading">Compressing...</div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No submitted forms yet.</p>
        )}
      </div>
    </div>
  );
}
