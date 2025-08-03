import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../spinner/Spinner';
import Results from '../results/Results';
import { Pagination } from './Pagination';
import { BookDetails } from '../book-details/BookDetails';
import { MainContentProps } from '../types/components';

export const MainContent = ({
  isLoading,
  error,
  results,
  currentPage,
  totalPages,
  onPageChange,
}: MainContentProps) => {
  const { detailsId, page = '1' } = useParams();
  const navigate = useNavigate();

  const handleMainPanelClick = () => {
    if (detailsId) {
      navigate(`/${page}`);
    }
  };

  return (
    <div className="main-content">
      <div className="results-section" onClick={handleMainPanelClick}>
        {isLoading && !error ? (
          <Spinner />
        ) : (
          <React.Fragment>
            <Results results={results} error={error} />
            {results.length > 0 && totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            )}
          </React.Fragment>
        )}
      </div>
      {detailsId && <BookDetails results={results} />}
    </div>
  );
};

export default MainContent;
