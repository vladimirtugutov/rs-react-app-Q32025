import { memo, useMemo } from 'react';
import type { ColumnKey, CountryListItem, OwidCountry } from '../../types/owid';
import { YearlyTable } from './YearlyTable';

type Props = {
  item: CountryListItem;
  year: number;
  selectedColumns: ColumnKey[];
  country: OwidCountry;
};

export const CountryCard = memo(function CountryCard({
  item,
  year,
  selectedColumns,
  country,
}: Props) {
  const rowForYear = useMemo(
    () => country.data.find((r) => r.year === year),
    [country.data, year]
  );

  return (
    <section>
      <h3>
        {item.name} {item.isoCode ? `(${item.isoCode})` : ''}
      </h3>
      <div>Население (последний год): {item.populationLatest ?? 'N/A'}</div>
      <YearlyTable data={country.data} selectedColumns={selectedColumns} />
      <div>
        Текущее значение за {year}: {rowForYear?.population ?? 'N/A'}
      </div>
    </section>
  );
});
