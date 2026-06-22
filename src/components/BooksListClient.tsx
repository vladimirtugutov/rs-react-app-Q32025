'use client';

import { useCallback } from 'react';
import { useRouter } from '@/i18n/navigation';
import { TopControls } from '@/components/Topcontrols/TopControls';
import { Results } from '@/components/Results/Results';
import { Pagination } from '@/components/Pagination/Pagination';
import { API_CONFIG } from '@/constants/api';
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

  const handlePageChange = useCallback(
    (newPage: number) => {
      const qs = initialQuery ? `?q=${encodeURIComponent(initialQuery)}` : '';
      router.push(`/${newPage}${qs}`);
    },
    [router, initialQuery]
  );

  const handleManualRefresh = useCallback(() => {
    router.refresh();
  }, [router]);

  const totalPages = Math.ceil(
    initialData.numFound / API_CONFIG.ITEMS_PER_PAGE
  );

  return (
    <>
      <TopControls
        locale={locale}
        initialQuery={initialQuery}
        isLoading={false}
        onManualRefresh={handleManualRefresh}
      />

      <Results results={initialData.docs} error={error} />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
};

export default BooksListClient;
