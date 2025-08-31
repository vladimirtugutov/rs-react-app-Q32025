import { useMemo, useState, useCallback } from 'react';
import { owidResource } from '../../data/owidResource';
import type { ColumnKey, CountryListItem, OwidRoot } from '../../types/owid';
import { CountriesList } from './CountriesList';
import { ColumnsModal } from '../columns/ColumnsModal';
import { YearSelector } from '../year/YearSelector';

export function CountriesPage() {
  const root: OwidRoot = owidResource.read();

  const [year, setYear] = useState<number>(2020);
  const [selectedCols, setSelectedCols] = useState<ColumnKey[]>([
    'year',
    'population',
    'co2',
    'co2_per_capita',
  ]);

  const allCountries: CountryListItem[] = useMemo(() => {
    return Object.entries(root).map(([key, val]) => {
      const name = (val.country as string) ?? key;
      const isoCode = (val.iso_code as string) || undefined;
      const populationLatest = [...val.data]
        .reverse()
        .find((r) => r.population !== undefined)?.population;
      return { key, name, isoCode, populationLatest };
    });
  }, [root]);

  const filteredSorted = useMemo(() => {
    let list = allCountries;

    if (region) {
      list = list.filter((c) => c.region === region);
    }

    if (q.trim()) {
      const n = q.trim().toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(n));
    }

    const byYearPopulation = (c: CountryListItem) => {
      const country = root[c.key];
      const row = country.data.find((r) => r.year === year);
      return row?.population ?? -Infinity;
    };

    list = [...list].sort((a, b) => {
      if (sortKey === 'name') {
        const cmp = a.name.localeCompare(b.name, 'en');
        return sortOrder === 'asc' ? cmp : -cmp;
      } else {
        const pa = byYearPopulation(a);
        const pb = byYearPopulation(b);
        const cmp = pa - pb;
        return sortOrder === 'asc' ? cmp : -cmp;
      }
    });

    return list;
  }, [allCountries, region, q, sortKey, sortOrder, root, year]);

  const onYearChange = useCallback((y: number) => setYear(y), []);
  const onColumnsChange = useCallback(
    (cols: ColumnKey[]) => setSelectedCols(cols),
    []
  );

  return (
    <div>
      <YearSelector year={year} onChange={onYearChange} />
      <ColumnsModal selected={selectedCols} onChange={onColumnsChange} />
      <CountriesList
        countries={filteredSorted}
        year={year}
        selectedColumns={selectedCols}
        root={root}
      />
    </div>
  );
}
