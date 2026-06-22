import { Link } from '@/i18n/navigation';
import { getVisiblePages } from '../../utils/pagination';
import { getTranslations } from 'next-intl/server';
import './Pagination.css';

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  query?: string;
};

export const Pagination = async ({
  currentPage,
  totalPages,
  query,
}: PaginationProps) => {
  const t = await getTranslations('Pagination');

  const buildHref = (page: number) =>
    query ? `/${page}?q=${encodeURIComponent(query)}` : `/${page}`;

  const pages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="pagination">
      {currentPage > 1 ? (
        <Link href={buildHref(currentPage - 1)}>{t('previous')}</Link>
      ) : (
        <span className="disabled">{t('previous')}</span>
      )}

      {pages.map((page, index) =>
        typeof page === 'number' ? (
          <Link
            key={index}
            href={buildHref(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </Link>
        ) : (
          <span key={index}>{page}</span>
        )
      )}

      {currentPage < totalPages ? (
        <Link href={buildHref(currentPage + 1)}>{t('next')}</Link>
      ) : (
        <span className="disabled">{t('next')}</span>
      )}
    </div>
  );
};

export default Pagination;
