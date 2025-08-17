// src/app/[locale]/page.tsx
import { redirect } from 'next/navigation';

export default function Page() {
  // Редиректим на первую страницу, чтобы даже /en -> /en/1
  redirect('/en/1');
  return null;
}
