import { memo, useMemo } from 'react';
import type { ColumnKey, CountryListItem, OwidCountry } from '../../types/owid';
import { YearlyTable } from './YearlyTable';

type Props = {
  item: CountryListItem;
  year: number;
  selectedColumns: ColumnKey[];
  country: OwidCountry;
};

const CountryCardComponent = ({
  item,
  year,
  selectedColumns,
  country,
}: Props) => {
  const rowForYear = useMemo(
    () => country.data.find((r) => r.year === year),
    [country.data, year]
  );

  return (
    <section className="country-card">
      <h3>
        {item.name} {item.isoCode ? `(${item.isoCode})` : ''}
      </h3>
      <div className="population-info">
        Population (latest year):{' '}
        {item.populationLatest?.toLocaleString() ?? 'N/A'}
      </div>

      <YearlyTable
        data={country.data}
        selectedColumns={selectedColumns}
        highlightYear={year}
      />

      <div className="population-info">
        Current value for {year}:{' '}
        {rowForYear?.population?.toLocaleString() ?? 'N/A'}
      </div>
    </section>
  );
};

export const CountryCard = memo(CountryCardComponent);
