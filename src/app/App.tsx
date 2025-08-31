// src/app/App.tsx
import { Suspense } from 'react';
import { CountriesPage } from '../features/countries/CountriesPage';

export function App() {
  return (
    <Suspense fallback={<div>Загрузка данных CO2…</div>}>
      <CountriesPage />
    </Suspense>
  );
}
