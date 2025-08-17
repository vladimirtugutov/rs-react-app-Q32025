// src/app/[locale]/layout.tsx
import { ThemeProvider } from '../../context/ThemeProvider';
import { StoreProvider } from '../../store/StoreProvider';
import { SelectedItemsFlyout } from '../../components/SelectedItemsFlyout';
import { ErrorButton } from '../../components/ErrorBoundary/ErrorButton';
import { ThemeSelector } from '../../components/ThemeSelector/ThemeSelector';

const LocaleLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <ThemeProvider>
        <div className="app-container">
          <header className="app-header">
            <ThemeSelector />
          </header>

          {children}

          <ErrorButton />
          <SelectedItemsFlyout />
        </div>
      </ThemeProvider>
    </StoreProvider>
  );
};

export default LocaleLayout;
