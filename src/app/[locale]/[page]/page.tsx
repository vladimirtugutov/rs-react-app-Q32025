'use client';
import { useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { SearchProvider } from '@/components/Search/SearchProvider';
import { TopControls } from '@/components/Topcontrols/TopControls';
import { Results } from '@/components/Results/Results';
import { Pagination } from '@/components/Pagination/Pagination';

const BooksListPage = () => {
  const router = useRouter();
  const params = useParams() as { locale: string; page: string };
  const currentPage = Number(params.page) || 1;

  const navigate = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const handlePageChange = (newPage: number) => {
    router.push(`/${params.locale}/${newPage}`);
  };

  return (
    <SearchProvider currentPage={currentPage} navigate={navigate}>
      {({
        isLoading,
        error,
        results,
        currentPage,
        totalPages,
        onManualRefresh,
      }) => (
        <>
          <TopControls
            onManualRefresh={onManualRefresh}
            isLoading={isLoading}
          />
          <Results
            results={results}
            error={error}
            // добавь остальные пропсы если надо
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </SearchProvider>
  );
};

export default BooksListPage;
