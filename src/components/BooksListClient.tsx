'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SearchProvider } from '@/components/Search/SearchProvider';
import { TopControls } from '@/components/Topcontrols/TopControls';
import { Results } from '@/components/Results/Results';
import { Pagination } from '@/components/Pagination/Pagination';
import { OpenLibraryResponse } from '@/types/book';

type BooksListClientProps = {
  initialData: OpenLibraryResponse;
  currentPage: number;
  locale: string;
  initialQuery: string;
  error?: string | null;
};

export const BooksListClient = ({
  initialData,
  currentPage,
  locale,
  initialQuery,
  error,
}: BooksListClientProps) => {
  const router = useRouter();

  const navigate = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      const currentUrl = new URLSearchParams(window.location.search);
      const query = currentUrl.get('q') || '';

      if (query) {
        router.push(`/${locale}/${newPage}?q=${encodeURIComponent(query)}`);
      } else {
        router.push(`/${locale}/${newPage}`);
      }
    },
    [router, locale]
  );

  return (
    <SearchProvider
      currentPage={currentPage}
      navigate={navigate}
      initialData={initialData}
      initialQuery={initialQuery}
      initialError={error}
    >
      {({
        isLoading,
        error: providerError,
        results,
        currentPage: providerCurrentPage,
        totalPages,
        onManualRefresh,
      }) => (
        <>
          <TopControls
            onManualRefresh={onManualRefresh}
            isLoading={isLoading}
          />

          <Results results={results} error={providerError} />

          {totalPages > 1 && (
            <Pagination
              currentPage={providerCurrentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </SearchProvider>
  );
};

export default BooksListClient;
