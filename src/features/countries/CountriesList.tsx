import { memo } from 'react';
import { CountryCard } from './CountryCard.js';
import type { CountryListItem, ColumnKey, OwidRoot } from '../../types/owid';

type Props = {
  countries: CountryListItem[];
  year: number;
  selectedColumns: ColumnKey[];
  root: OwidRoot;
};

export const CountriesList = memo(function CountriesList({
  countries,
  year,
  selectedColumns,
  root,
}: Props) {
  return (
    <div>
      {countries.map((c) => (
        <CountryCard
          key={c.key}
          item={c}
          year={year}
          selectedColumns={selectedColumns}
          country={root[c.key]}
        />
      ))}
    </div>
  );
});
