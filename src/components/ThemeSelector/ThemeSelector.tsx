import { useTheme } from '../../hooks/useTheme';
import './ThemeSelector.css';

type Theme = 'light' | 'dark';

export const ThemeSelector = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    const newTheme: Theme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <div className="theme-selector" data-testid="theme-selector">
      <label className="theme-toggle">
        <span data-testid="theme-label">Theme: {theme}</span>
        <button
          onClick={toggleTheme}
          className={`toggle-switch ${theme}`}
          type="button"
          aria-label="Toggle theme"
          data-testid="theme-toggle-button"
        >
          <span className="toggle-slider"></span>
        </button>
      </label>
    </div>
  );
};
