import { useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { Provider } from 'react-redux';
import { store } from '../store';
import './App.css';

export const App = () => {
  const [hasSimulatedError, setHasSimulatedError] = useState(false);

  const handleErrorButtonClick = () => {
    setHasSimulatedError(true);
  };

  if (hasSimulatedError) {
    throw new Error('Simulated error by Error Button click.');
  }

  return (
    <Provider store={store}>
      <div className="app-container">
        <RouterProvider router={router} />
        <div className="error-button-container">
          <button onClick={handleErrorButtonClick}>Error Button</button>
        </div>
      </div>
    </Provider>
  );
};
