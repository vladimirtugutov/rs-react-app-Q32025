import { Suspense } from 'react';
import { CountriesPage } from '../features/countries/CountriesPage';
import { CountriesListSkeleton } from '../features/countries/CountriesList.skeleton';

export const App = () => {
  return (
    <div>
      <Suspense fallback={<CountriesListSkeleton count={6} />}>
        <CountriesPage />
      </Suspense>
    </div>
  );
};
