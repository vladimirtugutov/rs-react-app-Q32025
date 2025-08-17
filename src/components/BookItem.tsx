'use client';
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { API_CONFIG } from '../constants/api';
import { Book } from '../types/book';
import { useAppDispatch } from '../store/hooks';
import { toggleItem } from '../store/selectedItemsSlice';

type BookItemProps = {
  book: Book;
  isSelected: boolean;
  isDetailSelected: boolean;
};

export const BookItem = ({
  book,
  isSelected,
  isDetailSelected,
}: BookItemProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();

  // Получаем page из URL параметров вместо useParams
  const page = searchParams.get('page') || '1';

  const getCoverUrl = (coverId: number | undefined) => {
    return coverId
      ? `${API_CONFIG.COVER_BASE_URL}/${coverId}-M.jpg`
      : undefined;
  };

  const handleBookClick = () => {
    if (!book.key) return;
    const bookId = book.key.replace('/works/', '');
    // Используем router.push вместо navigate
    router.push(`/${page}/${bookId}`);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (!book.key) return;

    const selectedItem = {
      id: book.key.replace('/works/', ''),
      title: book.title,
      authors: book.author_name,
      description: book.description || 'No description available',
      publishedDate: book.first_publish_year?.toString(),
      pageCount: undefined,
      categories: book.subject,
      thumbnail: getCoverUrl(book.cover_i),
      previewLink: `https://openlibrary.org${book.key}`,
    };

    dispatch(toggleItem(selectedItem));
  };

  return (
    <div
      className={`result-card ${isDetailSelected ? 'selected' : ''} ${isSelected ? 'checked' : ''}`}
      onClick={handleBookClick}
    >
      <label className="book-checkbox-container" htmlFor={`book-${book.key}`}>
        <input
          id={`book-${book.key}`}
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          className="book-checkbox"
          aria-label={`Select ${book.title}`}
        />
      </label>

      {book.cover_i && (
        <img
          src={getCoverUrl(book.cover_i)}
          alt={book.title}
          className="book-cover-small"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
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
    </div>
  );
};
