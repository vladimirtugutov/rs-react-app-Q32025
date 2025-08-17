import { getVisiblePages } from '../../utils/pagination';
import './Pagination.css';
import { useTranslations } from 'next-intl';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  const t = useTranslations('Pagination');
  const handlePreviousClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onPageChange(currentPage - 1);
  };

  const handleNextClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    onPageChange(currentPage + 1);
  };

  const handlePageClick = (page: number | string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (typeof page === 'number') {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination">
      <button onClick={handlePreviousClick} disabled={currentPage === 1}>
        {t('previous')}
      </button>

      {getVisiblePages(currentPage, totalPages).map((page, index) => (
        <button
          key={index}
          onClick={(event) => handlePageClick(page, event)}
          className={currentPage === page ? 'active' : ''}
          disabled={typeof page !== 'number'}
        >
          {page}
        </button>
      ))}

      <button onClick={handleNextClick} disabled={currentPage === totalPages}>
        {t('next')}
      </button>
    </div>
  );
};
