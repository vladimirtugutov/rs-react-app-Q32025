import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { UncontrolledForm } from './UncontrolledForm';
import formReducer from '../../store/formSlice';
import countriesReducer from '../../store/countriesSlice';

vi.mock('../../utils/imageUtils', () => ({
  compressImage: vi
    .fn()
    .mockResolvedValue('data:image/jpeg;base64,compressed-image-data'),
}));

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

describe('UncontrolledForm', () => {
  const mockOnSuccess = vi.fn();
  let alertSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.clearAllMocks();
    alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    if (alertSpy) {
      alertSpy.mockRestore();
    }
  });

  describe('when rendering form', () => {
    it('should display all required form fields', () => {
      renderWithProvider(<UncontrolledForm onSuccess={mockOnSuccess} />);

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

    it('should have submit button always enabled', () => {
      renderWithProvider(<UncontrolledForm onSuccess={mockOnSuccess} />);

      const submitButton = screen.getByRole('button', { name: 'Submit Form' });
      expect(submitButton).not.toBeDisabled();
    });

    it('should display form title', () => {
      renderWithProvider(<UncontrolledForm onSuccess={mockOnSuccess} />);

      expect(
        screen.getByText('Uncontrolled Form (DOM-managed)')
      ).toBeInTheDocument();
    });

    it('should have correct htmlFor label connections', () => {
      renderWithProvider(<UncontrolledForm onSuccess={mockOnSuccess} />);

      expect(screen.getByLabelText('Name:')).toHaveAttribute('id', 'name');
      expect(screen.getByLabelText('Age:')).toHaveAttribute('id', 'age');
      expect(screen.getByLabelText('Email:')).toHaveAttribute('id', 'email');
      expect(screen.getByLabelText('Password:')).toHaveAttribute(
        'id',
        'password'
      );
      expect(screen.getByLabelText('Confirm Password:')).toHaveAttribute(
        'id',
        'confirmPassword'
      );
      expect(screen.getByLabelText('Gender:')).toHaveAttribute('id', 'gender');
      expect(screen.getByLabelText('Country:')).toHaveAttribute(
        'id',
        'country'
      );
      expect(screen.getByLabelText('Upload Image (PNG/JPEG):')).toHaveAttribute(
        'id',
        'imageFile'
      );
    });
  });

  describe('when calculating password strength', () => {
    it('should show Very Weak for short password', async () => {
      const user = userEvent.setup();
      renderWithProvider(<UncontrolledForm onSuccess={mockOnSuccess} />);

      const passwordInput = screen.getByLabelText('Password:');
      await user.type(passwordInput, '123');

      expect(screen.getByText('Very Weak')).toBeInTheDocument();
      expect(screen.getByText('Very Weak')).toHaveClass('strength-very-weak');
    });

    it('should show Weak for password with only length', async () => {
      const user = userEvent.setup();
      renderWithProvider(<UncontrolledForm onSuccess={mockOnSuccess} />);

      const passwordInput = screen.getByLabelText('Password:');
      await user.type(passwordInput, 'password');

      expect(screen.getByText('Weak')).toBeInTheDocument();
      expect(screen.getByText('Weak')).toHaveClass('strength-weak');
    });

    it('should show Strong for password with multiple criteria', async () => {
      const user = userEvent.setup();
      renderWithProvider(<UncontrolledForm onSuccess={mockOnSuccess} />);

      const passwordInput = screen.getByLabelText('Password:');
      await user.type(passwordInput, 'Password1');

      expect(screen.getByText('Strong')).toBeInTheDocument();
      expect(screen.getByText('Strong')).toHaveClass('strength-strong');
    });

    it('should show Very Strong for password with all criteria', async () => {
      const user = userEvent.setup();
      renderWithProvider(<UncontrolledForm onSuccess={mockOnSuccess} />);

      const passwordInput = screen.getByLabelText('Password:');
      await user.type(passwordInput, 'Password1!');

      expect(screen.getByText('Very Strong')).toBeInTheDocument();
      expect(screen.getByText('Very Strong')).toHaveClass(
        'strength-very-strong'
      );
    });
  });

  describe('when handling form submission', () => {
    it('should submit form with valid data successfully', async () => {
      const user = userEvent.setup();
      const { store } = renderWithProvider(
        <UncontrolledForm onSuccess={mockOnSuccess} />
      );

      await user.type(screen.getByLabelText('Name:'), 'John Doe');
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

      const submitButton = screen.getByRole('button', { name: 'Submit Form' });
      await user.click(submitButton);

      await waitFor(
        () => {
          expect(mockOnSuccess).toHaveBeenCalledTimes(1);
        },
        { timeout: 5000 }
      );

      const state = store.getState();
      expect(state.form.formData).toHaveLength(1);
      expect(state.form.formData[0]).toMatchObject({
        name: 'John Doe',
        age: 25,
        email: 'john@example.com',
        gender: 'male',
        imageBase64: 'data:image/jpeg;base64,compressed-image-data',
      });
    });

    it('should show validation errors for empty form submission', async () => {
      const user = userEvent.setup();
      renderWithProvider(<UncontrolledForm onSuccess={mockOnSuccess} />);

      const submitButton = screen.getByRole('button', { name: 'Submit Form' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalled();
      });

      const alertMessage = alertSpy.mock.calls[0][0];
      expect(alertMessage).toContain(
        'Please fix the following validation errors'
      );
      expect(mockOnSuccess).not.toHaveBeenCalled();
    });

    it('should validate password mismatch on submit', async () => {
      const user = userEvent.setup();
      renderWithProvider(<UncontrolledForm onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText('Name:'), 'John Doe');
      await user.type(screen.getByLabelText('Age:'), '25');
      await user.type(screen.getByLabelText('Email:'), 'john@example.com');
      await user.type(screen.getByLabelText('Password:'), 'Password1!');
      await user.type(screen.getByLabelText('Confirm Password:'), 'Password2!');
      await user.selectOptions(screen.getByLabelText('Gender:'), 'male');
      await user.click(screen.getByLabelText('Accept Terms and Conditions'));
      await user.type(screen.getByLabelText('Country:'), 'United States');

      const submitButton = screen.getByRole('button', { name: 'Submit Form' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledTimes(1);
      });

      const alertMessage = alertSpy.mock.calls[0][0];
      expect(alertMessage).toContain(
        '• Confirm Password: Passwords must match'
      );
      expect(alertMessage).toContain('• Image Upload: Image is required');
    });
  });

  describe('when handling file upload', () => {
    it('should show validation error for missing image', async () => {
      const user = userEvent.setup();
      renderWithProvider(<UncontrolledForm onSuccess={mockOnSuccess} />);

      await user.type(screen.getByLabelText('Name:'), 'John Doe');
      await user.type(screen.getByLabelText('Age:'), '25');
      await user.type(screen.getByLabelText('Email:'), 'john@example.com');
      await user.type(screen.getByLabelText('Password:'), 'Password1!');
      await user.type(screen.getByLabelText('Confirm Password:'), 'Password1!');
      await user.selectOptions(screen.getByLabelText('Gender:'), 'male');
      await user.click(screen.getByLabelText('Accept Terms and Conditions'));
      await user.type(screen.getByLabelText('Country:'), 'United States');

      const submitButton = screen.getByRole('button', { name: 'Submit Form' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalled();
      });

      const alertMessage = alertSpy.mock.calls[0][0];
      expect(alertMessage).toContain('Image Upload: Image is required');
    });

it('should show alert for large file size on submit', async () => {
  const user = userEvent.setup();
  renderWithProvider(<UncontrolledForm onSuccess={mockOnSuccess} />);
  
  await user.type(screen.getByLabelText('Name:'), 'John Doe');
  await user.type(screen.getByLabelText('Age:'), '25');
  await user.type(screen.getByLabelText('Email:'), 'john@example.com');
  await user.type(screen.getByLabelText('Password:'), 'Password1!');
  await user.type(screen.getByLabelText('Confirm Password:'), 'Password1!');
  await user.selectOptions(screen.getByLabelText('Gender:'), 'male');
  await user.click(screen.getByLabelText('Accept Terms and Conditions'));
  await user.type(screen.getByLabelText('Country:'), 'United States');

  const largeFile = new File(['test'.repeat(2000000)], 'test.jpg', { 
    type: 'image/jpeg'
  });
  Object.defineProperty(largeFile, 'size', { value: 10 * 1024 * 1024 });
  
  const fileInput = screen.getByLabelText('Upload Image (PNG/JPEG):') as HTMLInputElement;
  await user.upload(fileInput, largeFile);

  const submitButton = screen.getByRole('button', { name: 'Submit Form' });
  await user.click(submitButton);

  await waitFor(() => {
    expect(alertSpy).toHaveBeenCalledWith('Image Upload: File size too large! Maximum 5MB allowed.');
  });
});

it('should accept valid image files', async () => {
  const user = userEvent.setup();
  renderWithProvider(<UncontrolledForm onSuccess={mockOnSuccess} />);

  const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  const fileInput = screen.getByLabelText('Upload Image (PNG/JPEG):') as HTMLInputElement;
  await user.upload(fileInput, file);

  expect(fileInput.files?.[0]).toBe(file);
  expect(fileInput.files?.[0]?.type).toBe('image/jpeg');
});
  });

  describe('when handling country autocomplete', () => {
    it('should show filtered countries when typing', async () => {
      const user = userEvent.setup();
      renderWithProvider(<UncontrolledForm onSuccess={mockOnSuccess} />);

      const countryInput = screen.getByLabelText('Country:');
      await user.type(countryInput, 'Can');

      await waitFor(() => {
        expect(screen.getByText('Canada')).toBeInTheDocument();
      });
    });

    it('should select country from dropdown', async () => {
      const user = userEvent.setup();
      renderWithProvider(<UncontrolledForm onSuccess={mockOnSuccess} />);

      const countryInput = screen.getByLabelText('Country:');
      await user.type(countryInput, 'Fra');

      await waitFor(() => {
        expect(screen.getByText('France')).toBeInTheDocument();
      });

      await user.click(screen.getByText('France'));

      expect(countryInput).toHaveValue('France');
      expect(screen.queryByText('France')).not.toBeInTheDocument();
    });

    it('should hide dropdown when input is cleared', async () => {
      const user = userEvent.setup();
      renderWithProvider(<UncontrolledForm onSuccess={mockOnSuccess} />);

      const countryInput = screen.getByLabelText('Country:');
      await user.type(countryInput, 'Can');

      await waitFor(() => {
        expect(screen.getByText('Canada')).toBeInTheDocument();
      });

      await user.clear(countryInput);

      expect(screen.queryByText('Canada')).not.toBeInTheDocument();
    });

    it('should limit dropdown to filtered results', async () => {
      const user = userEvent.setup();
      renderWithProvider(<UncontrolledForm onSuccess={mockOnSuccess} />);

      const countryInput = screen.getByLabelText('Country:');
      await user.type(countryInput, 'a');

      await waitFor(() => {
        const dropdownItems = screen.queryAllByRole('listitem');
        expect(dropdownItems.length).toBeGreaterThan(0);
        expect(dropdownItems.length).toBeLessThanOrEqual(10);
      });
    });
  });
});
