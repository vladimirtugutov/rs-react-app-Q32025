import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { About } from '../about/About';
import { NotFound } from '../not-found/NotFound';
import { ValidatedMainLayout } from './ValidatedMainLayout';
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
    <div className="app-container">
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/:page?/:detailsId?" element={<ValidatedMainLayout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <div className="error-button-container">
        <button onClick={handleErrorButtonClick}>Error Button</button>
      </div>
    </div>
  );
};
