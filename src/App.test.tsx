import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { App } from './App';
import formReducer from './store/formSlice';
import countriesReducer from './store/countriesSlice';

vi.mock('./utils/imageUtils', () => ({
  compressImage: vi.fn().mockResolvedValue('data:image/jpeg;base64,compressed'),
  validateImageFile: vi.fn().mockReturnValue(null),
}));

const createTestStore = () =>
  configureStore({
    reducer: {
      form: formReducer,
      countries: countriesReducer,
    },
  });

const renderApp = () => {
  const store = createTestStore();
  return {
    ...render(
      <Provider store={store}>
        <App />
      </Provider>
    ),
    store,
  };
};

describe('App', () => {
  describe('initial render', () => {
    it('should render main page', () => {
      renderApp();
      expect(screen.getByText('Main Page')).toBeInTheDocument();
    });

    it('should not show any modal initially', () => {
      renderApp();
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('modal interactions', () => {
    it('should open uncontrolled form modal', async () => {
      const user = userEvent.setup();
      renderApp();

      await user.click(
        screen.getByRole('button', { name: 'Open Uncontrolled Form' })
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(
        screen.getByText('Uncontrolled Form (DOM-managed)')
      ).toBeInTheDocument();
    });

    it('should open controlled form modal', async () => {
      const user = userEvent.setup();
      renderApp();

      await user.click(
        screen.getByRole('button', { name: 'Open Controlled Form' })
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(
        screen.getByText('Controlled Form (React Hook Form)')
      ).toBeInTheDocument();
    });

    it('should close modal when ESC is pressed', async () => {
      const user = userEvent.setup();
      renderApp();

      await user.click(
        screen.getByRole('button', { name: 'Open Uncontrolled Form' })
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.keyboard('{Escape}');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should close modal when close button is clicked', async () => {
      const user = userEvent.setup();
      renderApp();

      await user.click(
        screen.getByRole('button', { name: 'Open Controlled Form' })
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      await user.click(screen.getByLabelText('Close modal'));
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
