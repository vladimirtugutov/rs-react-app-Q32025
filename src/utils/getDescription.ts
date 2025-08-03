export const getDescription = (
  description: string | { value: string } | undefined
): string => {
  if (!description) return '';
  if (typeof description === 'string') return description;
  return description.value || '';
};
