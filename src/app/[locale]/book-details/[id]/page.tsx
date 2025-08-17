import { BookDetails } from '@/pages/book-details/BookDetails';

interface Props {
  params: { id: string; locale: string };
}

const BookDetailsPage = ({ params }: Props) => {
  const { id } = params;

  return <BookDetails />;
};

export default BookDetailsPage;
