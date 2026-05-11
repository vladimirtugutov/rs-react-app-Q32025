export const hasItems = <T>(array: T[] | null | undefined): boolean => {
  return !!(array && array.length > 0);
};
