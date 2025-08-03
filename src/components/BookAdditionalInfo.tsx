import { BookDetailsAPI } from '../types/book';
import { InfoSection } from './InfoSection';
import { isArrayWithItems } from '../utils/isArrayWithItems';

type Props = {
  data: BookDetailsAPI | null;
  error: string | null;
  getDescription: (desc: string | { value: string } | undefined) => string;
  formatLanguages: (langs?: Array<{ key: string }>) => string;
};

const MAX_ISBN_DISPLAY = 3;
const MAX_ADD_SUBJECTS_DISPLAY = 8;

export const BookAdditionalInfo = ({
  data,
  error,
  getDescription,
  formatLanguages,
}: Props) => {
  if (error) {
    return (
      <div className="error-section">
        <p className="error-message">
          Error loading additional details: {error}
        </p>
      </div>
    );
  }

  if (!data) return null;

  const hasAdditionalInfo =
    getDescription(data.description) ||
    data.number_of_pages ||
    (isArrayWithItems(data.languages) && data.languages.length > 0) ||
    data.isbn_10 ||
    data.isbn_13 ||
    (isArrayWithItems(data.subjects) && data.subjects.length > 0) ||
    data.publish_date;

  if (!hasAdditionalInfo) {
    return (
      <div className="no-additional-info">
        <p>No additional information available from the API</p>
      </div>
    );
  }

  return (
    <div className="api-details">
      {getDescription(data.description) && (
        <InfoSection title="Full Description:">
          <div className="description-content">
            <p>{getDescription(data.description)}</p>
          </div>
        </InfoSection>
      )}

      {data.number_of_pages && (
        <InfoSection title="Pages:">{data.number_of_pages}</InfoSection>
      )}

      {isArrayWithItems(data.languages) && (
        <InfoSection title="Languages:">
          <p>{formatLanguages(data.languages)}</p>
        </InfoSection>
      )}

      {(data.isbn_10 || data.isbn_13) && (
        <InfoSection title="ISBN:">
          <div className="isbn-list">
            {data.isbn_10 && (
              <p>
                <strong>ISBN-10:</strong>{' '}
                {data.isbn_10.slice(0, MAX_ISBN_DISPLAY).join(', ')}
              </p>
            )}
            {data.isbn_13 && (
              <p>
                <strong>ISBN-13:</strong>{' '}
                {data.isbn_13.slice(0, MAX_ISBN_DISPLAY).join(', ')}
              </p>
            )}
          </div>
        </InfoSection>
      )}

      {isArrayWithItems(data.subjects) && (
        <InfoSection title="Additional Subjects:">
          <p>{data.subjects.slice(0, MAX_ADD_SUBJECTS_DISPLAY).join(', ')}</p>
        </InfoSection>
      )}

      {data.publish_date && (
        <InfoSection title="Publish Date:">{data.publish_date}</InfoSection>
      )}
    </div>
  );
};
