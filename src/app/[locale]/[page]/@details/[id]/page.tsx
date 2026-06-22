import { BookDetails } from '@/components/BookDetails/BookDetails';
import { API_CONFIG, API_ENDPOINTS } from '@/constants/api';
import { BookDetailsAPI } from '@/types/book';

type Props = {
  params: Promise<{ id: string }>;
};

async function getBookDetails(id: string): Promise<BookDetailsAPI | null> {
  try {
    const res = await fetch(
      `${API_CONFIG.BASE_URL}${API_ENDPOINTS.BOOK_DETAILS}/${id}.json`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    return (await res.json()) as BookDetailsAPI;
  } catch {
    return null;
  }
}

const BookDetailsPage = async ({ params }: Props) => {
  const { id } = await params;
  const bookDetailsAPI = await getBookDetails(id);

  return <BookDetails bookId={id} bookDetailsAPI={bookDetailsAPI} />;
};

export default BookDetailsPage;
