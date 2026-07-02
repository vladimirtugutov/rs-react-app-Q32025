'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const switchLanguage = (newLocale: string) => {
    const query = searchParams.toString();
    router.push(query ? `${pathname}?${query}` : pathname, {
      locale: newLocale,
    });
  };

  return (
    <div className="language-switcher">
      <button
        onClick={() => switchLanguage('en')}
        className={`lang-btn ${locale === 'en' ? 'active' : ''}`}
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage('ru')}
        className={`lang-btn ${locale === 'ru' ? 'active' : ''}`}
      >
        RU
      </button>
    </div>
  );
};
