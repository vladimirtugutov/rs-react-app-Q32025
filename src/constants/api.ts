export const API_CONFIG = {
  BASE_URL: 'https://openlibrary.org/search.json',
  ITEMS_PER_PAGE: 10,
  COVER_BASE_URL: 'https://covers.openlibrary.org/b/id',
  REQUEST_DELAY: 500,
} as const;

export const API_ENDPOINTS = {
  SEARCH: API_CONFIG.BASE_URL,
  BOOK_DETAILS: 'https://openlibrary.org/works',
} as const;
