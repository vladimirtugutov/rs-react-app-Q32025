'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from '@/i18n/navigation';
import { searchBooksAction, SearchBooksState } from '@/app/actions/searchBooks';
import SearchInput from './SearchInput';
import SearchButton from './SearchButton';

type SearchFormProps = {
  initialQuery?: string;
};

const initialState: SearchBooksState = { redirectTo: null };

export const SearchForm = ({ initialQuery }: SearchFormProps) => {
  const router = useRouter();
  const [state, formAction] = useActionState(searchBooksAction, initialState);

  useEffect(() => {
    if (state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state.redirectTo, router]);

  return (
    <form action={formAction} className="search-controls">
      <SearchInput defaultValue={initialQuery} />
      <SearchButton />
    </form>
  );
};

export default SearchForm;
