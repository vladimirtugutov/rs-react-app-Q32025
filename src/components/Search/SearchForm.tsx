'use client';

import { searchBooksAction } from '@/app/actions/searchBooks';
import SearchInput from './SearchInput';
import SearchButton from './SearchButton';
import { RefreshButton } from '../Topcontrols/RefreshButton';

type SearchFormProps = {
  locale: string;
  initialQuery?: string;
  isLoading?: boolean;
  onManualRefresh?: () => void;
};

export const SearchForm = ({
  locale,
  initialQuery,
  isLoading = false,
  onManualRefresh,
}: SearchFormProps) => (
  <form action={searchBooksAction} className="search-controls">
    <input type="hidden" name="locale" value={locale} />
    <SearchInput defaultValue={initialQuery} />
    <SearchButton />
    <RefreshButton
      isLoading={isLoading}
      onRefresh={onManualRefresh ?? (() => {})}
    />
  </form>
);

export default SearchForm;
