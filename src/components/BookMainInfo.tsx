import { Book } from '../types/book';
import { InfoSection } from './InfoSection';
import { isArrayWithItems } from '../utils/isArrayWithItems';

type BookMainInfoProps = {
  book: Book;
  getCoverUrl: (coverId: number) => string;
};

const MAX_SUBJECTS_DISPLAY = 8;
const MAX_PUBLISHERS_DISPLAY = 8;

export const BookMainInfo = ({ book, getCoverUrl }: BookMainInfoProps) => (
  <>
    {book.cover_i && (
      <img
        src={getCoverUrl(book.cover_i)}
        alt={book.title}
        className="book-cover-large"
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    )}

    <div className="book-main-info">
      <h3>{book.title}</h3>

      {isArrayWithItems<string>(book.author_name) && (
        <InfoSection title="Authors:">
          {book.author_name.join(', ')}
        </InfoSection>
      )}

      {book.first_publish_year && (
        <InfoSection title="First Published:">
          {book.first_publish_year}
        </InfoSection>
      )}

      {isArrayWithItems<string>(book.publisher) && (
        <InfoSection title="Publishers:">
          {book.publisher.slice(0, MAX_PUBLISHERS_DISPLAY).join(', ')}
        </InfoSection>
      )}

      {book.description && (
        <InfoSection title="Generated Description:">
          {book.description}
        </InfoSection>
      )}

      {isArrayWithItems<string>(book.subject) && (
        <InfoSection title="Subjects:">
          {book.subject.slice(0, MAX_SUBJECTS_DISPLAY).join(', ')}
        </InfoSection>
      )}
    </div>
  </>
);
