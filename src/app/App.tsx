import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ThemeProvider } from '../context/ThemeProvider';
import { ThemeSelector } from '../components/ThemeSelector/ThemeSelector';
import { SelectedItemsFlyout } from '../components/SelectedItemsFlyout';
import { useAppSelector } from '../store/hooks';
import { selectSelectedItemsCount } from '../store/selectedItemsSlice';
import './App.css';

export const App = () => {
  const [hasSimulatedError, setHasSimulatedError] = useState(false);

  const handleErrorButtonClick = () => {
    setHasSimulatedError(true);
  };

  const selectedCount = useAppSelector(selectSelectedItemsCount);

  if (hasSimulatedError) {
    throw new Error('Simulated error by Error Button click.');
  }

  return (
    <ThemeProvider>
      <div className="app-container">
        <header className="app-header">
          <ThemeSelector />
        </header>

        <RouterProvider router={router} />

        <div
          className={`error-button-container ${selectedCount > 0 ? 'flyout-active' : ''}`}
        >
          <button onClick={handleErrorButtonClick}>Error Button</button>
        </div>

        <SelectedItemsFlyout />
      </div>
    </ThemeProvider>
  );
};
