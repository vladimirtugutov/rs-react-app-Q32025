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

vi.mock('../../utils/imageUtils', () => ({
  compressImage: vi.fn().mockResolvedValue('data:image/jpeg;base64,compressed'),
  validateImageFile: vi.fn().mockReturnValue(null),
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

    it('should show password mismatch indicator', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ControlledForm onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText('Password:'), 'Password1!');
      await user.type(screen.getByLabelText('Confirm Password:'), 'Password2!');

      expect(screen.getByText('✗ Passwords do not match')).toBeInTheDocument();
    });

    it('should show password match indicator', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ControlledForm onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText('Password:'), 'Password1!');
      await user.type(screen.getByLabelText('Confirm Password:'), 'Password1!');

      expect(screen.getByText('✓ Passwords match')).toBeInTheDocument();
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

  describe('when handling country autocomplete', () => {
    it('should show filtered countries when typing', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ControlledForm onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText('Country:'), 'Can');

      await waitFor(() => {
        expect(screen.getByText('Canada')).toBeInTheDocument();
      });
    });

    it('should select country from dropdown', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ControlledForm onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText('Country:'), 'Fra');

      await waitFor(() => {
        expect(screen.getByRole('list')).toBeInTheDocument();
      });

      await user.click(screen.getByText('France'));

      expect(screen.getByLabelText('Country:')).toHaveValue('France');
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });
  });

  describe('when handling file upload', () => {
    it('should accept valid image without alert', async () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      const user = userEvent.setup();
      renderWithProvider(<ControlledForm onSuccess={mockOnSuccess} />);

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await user.upload(
        screen.getByLabelText('Upload Image (PNG/JPEG):'),
        file
      );

      expect(alertSpy).not.toHaveBeenCalled();
      alertSpy.mockRestore();
    });

    it('should accept valid image and set value', async () => {
      const user = userEvent.setup();
      renderWithProvider(<ControlledForm onSuccess={mockOnSuccess} />);

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await user.upload(
        screen.getByLabelText('Upload Image (PNG/JPEG):'),
        file
      );

      await waitFor(() => {
        expect(screen.queryByText('Image is required')).not.toBeInTheDocument();
      });
    });
  });

  describe('when submitting form', () => {
    it('should call onSuccess after valid submission', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProvider(
        <ControlledForm onSuccess={mockOnSuccess} />
      );

      await user.type(screen.getByLabelText('Name:'), 'John');
      await user.type(screen.getByLabelText('Age:'), '25');
      await user.type(screen.getByLabelText('Email:'), 'john@example.com');
      await user.type(screen.getByLabelText('Password:'), 'Password1!');
      await user.type(screen.getByLabelText('Confirm Password:'), 'Password1!');
      await user.selectOptions(screen.getByLabelText('Gender:'), 'male');
      await user.click(screen.getByLabelText('Accept Terms and Conditions'));
      await user.type(screen.getByLabelText('Country:'), 'United States');

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      await user.upload(
        screen.getByLabelText('Upload Image (PNG/JPEG):'),
        file
      );

      // ждём пока FileReader отработает и imageBase64 установится
      await waitFor(
        () => {
          expect(
            screen.getByRole('button', { name: 'Submit Form' })
          ).not.toBeDisabled();
        },
        { timeout: 5000 }
      );

      await user.click(screen.getByRole('button', { name: 'Submit Form' }));

      await waitFor(
        () => {
          expect(mockOnSuccess).toHaveBeenCalledTimes(1);
        },
        { timeout: 10000 }
      );

      const state = store.getState();
      expect(state.form.formData[0]).toMatchObject({
        name: 'John',
        age: 25,
        email: 'john@example.com',
        gender: 'male',
      });
    }, 15000);
  });
});
