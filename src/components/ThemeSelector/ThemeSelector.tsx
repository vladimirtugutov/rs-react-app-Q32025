'use client';
import { useTheme } from '../../context/ThemeProvider';
import { useTranslations } from 'next-intl';
import './ThemeSelector.css';

type Theme = 'light' | 'dark';

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();
  const t = useTranslations('Theme');

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <div className="theme-selector" data-testid="theme-selector">
      <label className="theme-toggle">
        <span data-testid="theme-label">
          {t('label')}: {t(theme)}
        </span>
        <button
          onClick={toggleTheme}
          className={`toggle-switch ${theme}`}
          type="button"
          aria-label={t('toggleAriaLabel')}
          data-testid="theme-toggle-button"
        >
          <span className="toggle-slider"></span>
        </button>
      </label>
    </div>
  );
};
