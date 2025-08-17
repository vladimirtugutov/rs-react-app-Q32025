import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Book Search App',
  description: 'Search and discover books',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
