'use client';

import { ReactNode } from 'react';
import { usePathname } from '@/i18n/navigation';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectSelectedItems, toggleItem } from '../store/selectedItemsSlice';
import { useTranslations } from 'next-intl';
import { API_CONFIG } from '../constants/api';
import { Book } from '../types/book';

type BookCardControlsProps = {
  book: Book;
  children: ReactNode;
};

export const BookCardControls = ({ book, children }: BookCardControlsProps) => {
  const t = useTranslations('Search');
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector(selectSelectedItems);

  const bookId = book.key?.replace('/works/', '') || '';

  const isSelected = selectedItems.some((item) => item.id === bookId);
  const isDetailSelected = pathname.endsWith(`/${bookId}`);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    dispatch(
      toggleItem({
        id: bookId,
        title: book.title,
        authors: book.author_name,
        description: book.description || 'No description available',
        publishedDate: book.first_publish_year?.toString(),
        pageCount: undefined,
        categories: book.subject,
        thumbnail: book.cover_i
          ? `${API_CONFIG.COVER_BASE_URL}/${book.cover_i}-M.jpg`
          : undefined,
        previewLink: `https://openlibrary.org${book.key}`,
      })
    );
  };

  return (
    <div
      className={`result-card ${isDetailSelected ? 'selected' : ''} ${isSelected ? 'checked' : ''}`}
    >
      <label
        className="book-checkbox-container"
        htmlFor={`book-${bookId}`}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          id={`book-${bookId}`}
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          className="book-checkbox"
          aria-label={t('selectBook')}
        />
      </label>

      {children}
    </div>
  );
};

export default BookCardControls;
