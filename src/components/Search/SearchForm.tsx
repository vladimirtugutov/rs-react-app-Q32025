'use client';

import { searchBooksAction } from '@/app/actions/searchBooks';
import SearchInput from './SearchInput';
import SearchButton from './SearchButton';

type SearchFormProps = {
  locale: string;
  initialQuery?: string;
};

export const SearchForm = ({ locale, initialQuery }: SearchFormProps) => (
  <form action={searchBooksAction} className="search-controls">
    <input type="hidden" name="locale" value={locale} />
    <SearchInput defaultValue={initialQuery} />
    <SearchButton />
  </form>
);

export default SearchForm;
