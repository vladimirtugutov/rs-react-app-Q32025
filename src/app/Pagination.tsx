import { PaginationProps } from '../types/components';
import { getVisiblePages } from '../utils/getVisiblePages';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {visiblePages.map((page, index) => (
        <button
          key={index}
          onClick={() =>
            typeof page === 'number' ? onPageChange(page) : undefined
          }
          className={currentPage === page ? 'active' : ''}
          disabled={typeof page !== 'number'}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};
