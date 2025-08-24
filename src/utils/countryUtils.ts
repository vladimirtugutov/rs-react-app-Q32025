export const filterCountries = (
  countries: string[],
  query: string
): string[] => {
  if (!query.trim()) {
    return [];
  }

  const lowerQuery = query.toLowerCase();
  const filtered = countries.filter((country) =>
    country.toLowerCase().includes(lowerQuery)
  );

  return filtered.slice(0, 10);
};
