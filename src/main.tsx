import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import './index.css';
import { App } from './app/App.tsx';
import { store } from './store/index.ts';
import ErrorBoundary from './error-boundary/ErrorBoundary.js';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Provider store={store}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </Provider>
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}
