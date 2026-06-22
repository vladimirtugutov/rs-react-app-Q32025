import { notFound } from 'next/navigation';
import { TopControls } from '@/components/topcontrols/TopControls';
import { Results } from '@/components/Results/Results';
import { Pagination } from '@/components/Pagination/Pagination';
import { API_CONFIG } from '@/constants/api';
import { OpenLibraryResponse, OpenLibraryBook, Book } from '@/types/book';

type Props = {
  params: Promise<{ locale: string; page: string }>;
  searchParams: Promise<{ q?: string }>;
};

const transformOpenLibraryBook = (doc: OpenLibraryBook): Book => ({
  key: doc.key,
  title: doc.title || '',
  author_name: doc.author_name ?? [],
  first_publish_year: doc.first_publish_year,
  cover_i: doc.cover_i,
  subject: doc.subject ?? [],
  isbn: doc.isbn ?? [],
  publisher: doc.publisher ?? [],
});

export default async function BooksListPage({ params, searchParams }: Props) {
  const { locale, page } = await params;
  const { q = '' } = await searchParams;

  const currentPage = Number(page);

  if (!currentPage || currentPage < 1 || !Number.isInteger(currentPage)) {
    notFound();
  }

  let initialData: OpenLibraryResponse;
  let error: string | null = null;

  try {
    const searchQuery = q || 'javascript';
    const apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=${API_CONFIG.ITEMS_PER_PAGE}`;

    const response = await fetch(apiUrl, { cache: 'no-store' });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    initialData = (await response.json()) as OpenLibraryResponse;
  } catch (fetchError) {
    console.error('Failed to fetch books:', fetchError);
    error =
      fetchError instanceof Error
        ? fetchError.message
        : 'Failed to fetch books';
    initialData = { docs: [], numFound: 0, start: 0 };
  }

  const books = initialData.docs.map(transformOpenLibraryBook);
  const totalPages = Math.ceil(
    initialData.numFound / API_CONFIG.ITEMS_PER_PAGE
  );

  return (
    <div className="books-page">
      <TopControls locale={locale} initialQuery={q} />
      <Results results={books} error={error} />
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          query={q}
        />
      )}
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { locale: 'en', page: '1' },
    { locale: 'ru', page: '1' },
    { locale: 'en', page: '2' },
    { locale: 'ru', page: '2' },
  ];
}

export const dynamicParams = false;
