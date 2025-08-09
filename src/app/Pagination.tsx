import { PaginationProps } from '../types/components';
import { getVisiblePages } from '../utils/pagination';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const handlePreviousClick = () => {
    onPageChange(currentPage - 1);
  };

  const handleNextClick = () => {
    onPageChange(currentPage + 1);
  };

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination">
      <button onClick={handlePreviousClick} disabled={currentPage === 1}>
        Previous
      </button>

      {getVisiblePages(currentPage, totalPages).map((page, index) => (
        <button
          key={index}
          onClick={() => handlePageClick(page)}
          className={currentPage === page ? 'active' : ''}
          disabled={typeof page !== 'number'}
        >
          {page}
        </button>
      ))}

      <button onClick={handleNextClick} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
};