import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Search App',
  description: 'Search and discover books',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
