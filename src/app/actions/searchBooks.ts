'use server';

export type SearchBooksState = {
  redirectTo: string | null;
};

export async function searchBooksAction(
  _prevState: SearchBooksState,
  formData: FormData
): Promise<SearchBooksState> {
  const query = (formData.get('q') as string)?.trim() || '';

  const params = new URLSearchParams();
  if (query) params.set('q', query);

  const qs = params.toString();
  const redirectTo = `/1${qs ? `?${qs}` : ''}`;

  return { redirectTo };
}
