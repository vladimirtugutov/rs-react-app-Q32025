import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { API_CONFIG } from '../constants/api';
import { Book } from '../types/book';
import { BookCardControls } from './BookCardControls';

type BookItemProps = {
  book: Book;
};

export const BookItem = ({ book }: BookItemProps) => {
  if (!book.key) return null;

  const bookId = book.key.replace('/works/', '');
  const coverUrl = book.cover_i
    ? `${API_CONFIG.COVER_BASE_URL}/${book.cover_i}-M.jpg`
    : undefined;

  return (
    <BookCardControls book={book}>
      <Link href={`/${bookId}`} className="result-card-link">
        {coverUrl && (
          <Image
            src={coverUrl}
            alt={book.title}
            width={128}
            height={192}
            className="book-cover-small"
          />
        )}

        <div className="book-info-minimal">
          <h3 className="book-title">{book.title}</h3>
          {book.author_name && book.author_name.length > 0 && (
            <p className="book-author">
              by {book.author_name.slice(0, 2).join(', ')}
            </p>
          )}
        </div>
      </Link>
    </BookCardControls>
  );
};

export default BookItem;
