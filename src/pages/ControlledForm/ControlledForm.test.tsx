import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ControlledForm } from './ControlledForm';
import formReducer from '../../store/formSlice';
import countriesReducer from '../../store/countriesSlice';

vi.mock('uuid', () => ({
  v4: () => 'test-uuid-123',
}));

type TestStore = ReturnType<typeof createTestStore>;

const createTestStore = () =>
  configureStore({
    reducer: {
      form: formReducer,
      countries: countriesReducer,
    },
    preloadedState: {
      countries: ['United States', 'Canada', 'France', 'Germany', 'Brazil'],
      form: { formData: [], highlightedId: null },
    },
  });

type RenderWithProviderReturn = {
  store: TestStore;
} & ReturnType<typeof render>;

const renderWithProvider = (
  component: React.ReactNode
): RenderWithProviderReturn => {
  const store = createTestStore();
  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe('ControlledForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when rendering with required fields', () => {
    it('should display all required form fields', () => {
      renderWithProvider(<ControlledForm onSuccess={mockOnSuccess} />);

      expect(screen.getByLabelText('Name:')).toBeInTheDocument();
      expect(screen.getByLabelText('Age:')).toBeInTheDocument();
      expect(screen.getByLabelText('Email:')).toBeInTheDocument();
      expect(screen.getByLabelText('Password:')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm Password:')).toBeInTheDocument();
      expect(screen.getByLabelText('Gender:')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Accept Terms and Conditions')
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Country:')).toBeInTheDocument();
      expect(
        screen.getByLabelText('Upload Image (PNG/JPEG):')
      ).toBeInTheDocument();
    });

    it('should have disabled submit button initially', () => {
      renderWithProvider(<ControlledForm onSuccess={mockOnSuccess} />);

      expect(
        screen.getByRole('button', { name: 'Submit Form' })
      ).toBeDisabled();
    });

    it('should display form title', () => {
      renderWithProvider(<ControlledForm onSuccess={mockOnSuccess} />);

      expect(
        screen.getByText('Controlled Form (React Hook Form)')
      ).toBeInTheDocument();
    });
  });

  describe('when validating fields', () => {
    it('should validate name starts with uppercase letter', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ControlledForm onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText('Name:'), 'john');
      await user.tab();

      await waitFor(() => {
        expect(
          screen.getByText('Must start with an uppercase letter')
        ).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ControlledForm onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText('Email:'), 'invalid-email');
      await user.tab();

      await waitFor(() => {
        expect(screen.getByText('Invalid email')).toBeInTheDocument();
      });
    });
  });

  describe('when calculating password strength', () => {
    it('should show Very Weak for short password', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ControlledForm onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText('Password:'), '123');

      expect(screen.getByText('Very Weak')).toBeInTheDocument();
    });

    it('should show Very Strong for password with all criteria', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ControlledForm onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText('Password:'), 'Password1!');

      expect(screen.getByText('Very Strong')).toBeInTheDocument();
    });
  });
});
