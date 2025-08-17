'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPath = segments.join('/');
    router.push(newPath);
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
