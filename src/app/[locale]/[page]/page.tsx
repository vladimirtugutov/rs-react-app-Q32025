import { Suspense } from 'react';
import { BooksListClient } from '@/components/BooksListClient';
import { API_CONFIG } from '@/constants/api';

interface Props {
  params: Promise<{ locale: string; page: string }>;
  searchParams: Promise<{ q?: string; filter?: string }>;
}

export default async function BooksListPage({ params, searchParams }: Props) {
  const { locale, page } = await params;
  const { q = '' } = await searchParams;

  const currentPage = Number(page) || 1;

  let initialData = null;
  let error = null;

  try {
    const searchQuery = q || 'javascript';
    const apiUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}&page=${currentPage}&limit=${API_CONFIG.ITEMS_PER_PAGE}`;

    const response = await fetch(apiUrl, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    initialData = await response.json();
  } catch (fetchError) {
    console.error('Failed to fetch books:', fetchError);
    error =
      fetchError instanceof Error
        ? fetchError.message
        : 'Failed to fetch books';

    initialData = {
      docs: [],
      num_found: 0,
      start: 0,
      num_pages: 1,
    };
  }

  return (
    <div className="books-page">
      <Suspense fallback={<div>Loading books...</div>}>
        <BooksListClient
          initialData={initialData}
          currentPage={currentPage}
          locale={locale}
          initialQuery={q}
          error={error}
        />
      </Suspense>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { locale: 'en', page: '1' },
    { locale: 'ru', page: '1' },
  ];
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params;
  const { q } = await searchParams;

  const title = q ? `Search: ${q}` : 'Book Search';

  return {
    title: `${title} - Page ${(await params).page}`,
    description: 'Search and discover books using OpenLibrary API',
    alternates: {
      canonical: `/${locale}/${(await params).page}${q ? `?q=${q}` : ''}`,
    },
  };
}
