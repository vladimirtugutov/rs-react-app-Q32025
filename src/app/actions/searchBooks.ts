'use server';

import { redirect } from 'next/navigation';

export async function searchBooksAction(formData: FormData) {
  const query = (formData.get('q') as string)?.trim() || '';
  const locale = (formData.get('locale') as string) || 'en';

  const params = new URLSearchParams();
  if (query) params.set('q', query);

  const qs = params.toString();
  redirect(`/${locale}/1${qs ? `?${qs}` : ''}`);
}
