import { CountryCardSkeleton } from './CountryCard.skeleton';

export const CountriesListSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div style={{ padding: 16 }}>
      {Array.from({ length: count }).map((_, i) => (
        <CountryCardSkeleton key={i} />
      ))}
    </div>
  );
};
