import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '../../i18n/routing';
import { ThemeProvider } from '../../context/ThemeProvider';
import { StoreProvider } from '../../store/StoreProvider';
import { SelectedItemsFlyout } from '../../components/SelectedItemsFlyout';
import { ErrorButton } from '../../components/ErrorBoundary/ErrorButton';
import { ThemeSelector } from '../../components/ThemeSelector/ThemeSelector';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

const LocaleLayout = async ({ children, params }: Props) => {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'en' | 'ru')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <StoreProvider>
            <ThemeProvider>
              <div className="app-container">
                <header className="app-header">
                  <ThemeSelector />
                  <LanguageSwitcher />
                </header>
                {children}
                <ErrorButton />
                <SelectedItemsFlyout />
              </div>
            </ThemeProvider>
          </StoreProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default LocaleLayout;
