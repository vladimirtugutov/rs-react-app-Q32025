import { BookDetails } from '@/pages/book-details/BookDetails';

interface Props {
  params: { id: string; locale: string };
}

const BookDetailsPage = ({ params }: Props) => {
  const { id } = params;
  console.log(id);

  return <BookDetails />;
};

export default BookDetailsPage;
