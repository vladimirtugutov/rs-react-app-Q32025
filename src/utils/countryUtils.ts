const MAX_FILTERED_COUNTRIES = 10;

export const filterCountries = (countries: string[], query: string) => {
  if (!query.trim()) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  const filtered = countries.filter((country) =>
    country.toLowerCase().includes(lowerQuery)
  );

  return filtered.slice(0, MAX_FILTERED_COUNTRIES);
};
