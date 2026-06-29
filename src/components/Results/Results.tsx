import './Results.css';
import { Book } from '../../types/book';
import { BookItem } from '../BookItem';
import { useTranslations } from 'next-intl';

type ResultsProps = {
  results: Book[];
  currentPage: number;
  error?: string | null;
};

export const Results = ({ results, currentPage, error }: ResultsProps) => {
  const t = useTranslations('Search');

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!results || results.length === 0) {
    return <div className="no-results">{t('noResults')}</div>;
  }

  return (
    <div className="results-table">
      {results.map((book) => (
        <BookItem key={book.key} book={book} currentPage={currentPage} />
      ))}
    </div>
  );
};

export default Results;
