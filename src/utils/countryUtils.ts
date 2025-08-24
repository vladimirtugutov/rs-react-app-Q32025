export const filterCountries = (
  countries: string[],
  query: string
): string[] => {
  return countries
    .filter((country) => country.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 10);
};
