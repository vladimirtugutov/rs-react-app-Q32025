import { isArrayWithItems } from './isArrayWithItems';

const MAX_LANG = 3;

export const formatLanguages = (languages?: Array<{ key: string }>): string => {
  if (!isArrayWithItems(languages)) return 'Unknown';
  return languages
    .map((lang) => lang.key.replace('/languages/', '').toUpperCase())
    .slice(0, MAX_LANG)
    .join(', ');
};
