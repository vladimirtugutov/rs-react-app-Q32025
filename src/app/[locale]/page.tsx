// src/app/[locale]/page.tsx
'use client';
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { SearchProvider } from '@/components/Search/SearchProvider';
import { TopControls } from '@/components/Topcontrols/TopControls';
import { Results } from '@/components/Results/Results';

const HomePage = () => {
  const router = useRouter();

  // Navigate функция для Next.js
  const navigate = useCallback(
    (path: string) => {
      router.push(path);
    },
    [router]
  );

  const currentPage = 1; // Можно получить из URL параметров

  return (
    <SearchProvider currentPage={currentPage} navigate={navigate}>
      {({
        isLoading,
        error,
        results,
        currentPage,
        totalPages,
        onPageChange,
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
            // Добавь остальные пропсы которые нужны Results
          />
        </>
      )}
    </SearchProvider>
  );
};

export default HomePage;
