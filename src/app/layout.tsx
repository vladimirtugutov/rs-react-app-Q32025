import type { Metadata } from 'next';
import { ThemeProvider } from '@/context/ThemeProvider';
import { StoreProvider } from '@/store/StoreProvider';
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
    <html lang="en">
      <body>
        <StoreProvider>
          <ThemeProvider>
            <div className="app-container">{children}</div>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
