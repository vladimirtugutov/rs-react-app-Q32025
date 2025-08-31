import type { ColumnKey, CountryListItem, OwidCountry } from '../../types/owid';
import { YearlyTable } from './YearlyTable';

type Props = {
  item: CountryListItem;
  year: number;
  selectedColumns: ColumnKey[];
  country: OwidCountry;
};

export const CountryCard = ({
  item,
  year,
  selectedColumns,
  country,
}: Props) => {
  const rowForYear = country.data.find((r) => r.year === year);

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
