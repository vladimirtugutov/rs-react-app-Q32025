import { useState } from 'react';
import { owidResource } from '../../data/owidResource';
import { CountriesList } from './CountriesList';
import { ColumnsModal } from '../columns/ColumnsModal';
import { YearSelector } from '../year/YearSelector';
import type {
  OwidRoot,
  ColumnKey,
  CountryListItem,
  SortKey,
  SortOrder,
} from '../../types/owid';

const useOwidRoot = (): OwidRoot => {
  return owidResource.read();
};

const populationByYear = (
  root: OwidRoot,
  key: string,
  year: number
): number | undefined => {
  const row = root[key]?.data.find((r) => r.year === year);
  return row?.population;
};

export const CountriesPage = () => {
  const [year, setYear] = useState<number>(2020);
  const [selectedCols, setSelectedCols] = useState<ColumnKey[]>([
    'year',
    'population',
    'co2',
    'co2_per_capita',
  ]);
  const [q, setQ] = useState<string>('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const root: OwidRoot = useOwidRoot();

  const allCountries: CountryListItem[] = Object.entries(root).map(
    ([key, val]) => {
      const name = (val.country as string) ?? key;
      const isoCode = (val.iso_code as string) || undefined;
      const populationLatest = [...val.data]
        .reverse()
        .find((r) => r.population !== undefined)?.population;
      return { key, name, isoCode, populationLatest };
    }
  );

  let filtered = allCountries;
  if (q.trim()) {
    const searchTerm = q.trim().toLowerCase();
    filtered = allCountries.filter((c) =>
      c.name.toLowerCase().includes(searchTerm)
    );
  }

  const sorted = [...filtered].sort((a, b) => {
    if (sortKey === 'name') {
      const cmp = a.name.localeCompare(b.name, 'en');
      return sortOrder === 'asc' ? cmp : -cmp;
    } else {
      const pa =
        populationByYear(root, a.key, year) ?? Number.NEGATIVE_INFINITY;
      const pb =
        populationByYear(root, b.key, year) ?? Number.NEGATIVE_INFINITY;
      const cmp = pa - pb;
      return sortOrder === 'asc' ? cmp : -cmp;
    }
  });

  const onYear = (y: number) => setYear(y);
  const onCols = (cols: ColumnKey[]) => setSelectedCols(cols);
  const onSearch = (v: string) => setQ(v);
  const onSort = (k: SortKey, o: SortOrder) => {
    setSortKey(k);
    setSortOrder(o);
  };

  return (
    <div>
      {/* Header controls */}
      <div className="app-header">
        <div className="header-controls">
          <YearSelector year={year} onChange={onYear} />
          <input
            className="search-input"
            value={q}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search country..."
          />
          <select
            className="sort-select"
            value={`${sortKey}:${sortOrder}`}
            onChange={(e) => {
              const [k, o] = e.target.value.split(':') as [SortKey, SortOrder];
              onSort(k, o);
            }}
          >
            <option value="name:asc">Name A-Z</option>
            <option value="name:desc">Name Z-A</option>
            <option value="population:asc">Population (year) ascending</option>
            <option value="population:desc">
              Population (year) descending
            </option>
          </select>
        </div>
        <div className="columns-modal">
          <ColumnsModal selected={selectedCols} onChange={onCols} />
        </div>
      </div>

      <div className="content">
        {sorted.length === 0 ? (
          <div className="no-results">
            {q.trim()
              ? `No results found for "${q.trim()}"`
              : 'No data available to display'}
          </div>
        ) : (
          <>
            <div className="results-count">Found {sorted.length} countries</div>
            <CountriesList
              countries={sorted}
              year={year}
              selectedColumns={selectedCols}
              root={root}
            />
          </>
        )}
      </div>
    </div>
  );
};
