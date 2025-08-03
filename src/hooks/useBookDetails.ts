import { useState, useEffect } from 'react';
import { BookDetailsAPI } from '../types/book';
import { API_ENDPOINTS } from '../constants/api';

export const useBookDetails = (detailsId?: string | null) => {
  const [bookDetailsAPI, setBookDetailsAPI] = useState<BookDetailsAPI | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!detailsId) return;

    const fetchBookDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${API_ENDPOINTS.BOOK_DETAILS}/${detailsId}.json`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch book details: ${response.status}`);
        }

        const data: BookDetailsAPI = await response.json();
        setBookDetailsAPI(data);
      } catch (err) {
        setError((err as Error).message);
        console.error('Error fetching book details:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
  }, [detailsId]);

  return { bookDetailsAPI, isLoading, error };
};
