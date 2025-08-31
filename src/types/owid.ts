export type OwidYearRow = {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
} & {
  [k: string]: number | string | undefined;
};

export type OwidCountryMeta = {
  iso_code?: string;
  country?: string;
  [k: string]: number | string | undefined;
};

export type OwidCountry = {
  data: OwidYearRow[];
} & OwidCountryMeta;

export type OwidRoot = {
  [countryKey: string]: OwidCountry;
};

export type CountryListItem = {
  key: string;
  name: string;
  isoCode?: string;
  populationLatest?: number;
  region?: string;
};

export type ColumnKey =
  | 'year'
  | 'population'
  | 'co2'
  | 'co2_per_capita'
  | string;

export type SortKey = 'name' | 'population';
export type SortOrder = 'asc' | 'desc';
