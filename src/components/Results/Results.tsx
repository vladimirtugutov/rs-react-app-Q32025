import './Results.css';
import { Book } from '../../types/book';
import { BookItem } from '../BookItem';
import { useTranslations } from 'next-intl';

type ResultsProps = {
  results: Book[];
  error?: string | null;
};

export const Results = ({ results, error }: ResultsProps) => {
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
        <BookItem key={book.key} book={book} />
      ))}
    </div>
  );
};

export default Results;
