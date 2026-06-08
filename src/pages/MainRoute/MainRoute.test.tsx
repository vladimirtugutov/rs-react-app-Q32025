import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import formReducer from '../../store/formSlice';
import countriesReducer from '../../store/countriesSlice';
import { MainRoute } from './MainRoute';
import type { FormSubmission } from '../../utils/formSchema';

vi.mock('../../utils/imageUtils', () => ({
  compressImage: vi.fn(),
}));

const mockCompressImage = vi.mocked(
  await import('../../utils/imageUtils')
).compressImage;

const createTestStore = (initialFormData: FormSubmission[] = []) =>
  configureStore({
    reducer: {
      form: formReducer,
      countries: countriesReducer,
    },
    preloadedState: {
      form: {
        formData: initialFormData,
        highlightedId:
          initialFormData.length > 0 ? initialFormData[0].id : null,
      },
      countries: ['USA', 'UK'],
    },
  });

const mockFormData: FormSubmission = {
  id: 'test-id-1',
  name: 'John Doe',
  age: 25,
  email: 'john@example.com',
  password: 'password123',
  gender: 'male',
  termsAccepted: true,
  imageBase64: 'data:image/jpeg;base64,testImageData',
  country: 'USA',
};

const renderWithStore = (formData: FormSubmission[] = []) => {
  const store = createTestStore(formData);
  const result = render(
    <Provider store={store}>
      <MainRoute onOpenUncontrolled={vi.fn()} onOpenControlled={vi.fn()} />
    </Provider>
  );
  return { ...result, store };
};

describe('MainRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCompressImage.mockResolvedValue('data:image/jpeg;base64,compressed');
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('basic rendering', () => {
    it('should render main page title', () => {
      renderWithStore();
      expect(screen.getByText('Main Page')).toBeInTheDocument();
    });

    it('should render no forms message when no data', () => {
      renderWithStore();
      expect(screen.getByText('No submitted forms yet.')).toBeInTheDocument();
    });
  });

  describe('with form data', () => {
    it('should render form data cards', () => {
      renderWithStore([mockFormData]);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('john@example.com')).toBeInTheDocument();
      expect(screen.getByText('male')).toBeInTheDocument();
      expect(screen.getByText('USA')).toBeInTheDocument();
    });

    it('should show clear button when form data exists', () => {
      renderWithStore([mockFormData]);
      expect(
        screen.getByRole('button', { name: 'Clear All Data' })
      ).toBeInTheDocument();
    });

    it('should dispatch clearFormData when clear button clicked', async () => {
      const user = userEvent.setup();
      const { store } = renderWithStore([mockFormData]);
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      await user.click(screen.getByRole('button', { name: 'Clear All Data' }));

      expect(dispatchSpy).toHaveBeenCalledWith({ type: 'form/clearFormData' });
    });

    it('should show highlighted card when highlightedId matches', () => {
      renderWithStore([mockFormData]);
      const card = screen.getByText('John Doe').closest('.card');
      expect(card).toHaveClass('highlighted');
    });
  });

  describe('useEffect for clearHighlight', () => {
    it('should clear highlight after 5 seconds', () => {
      vi.useFakeTimers();
      const store = createTestStore([mockFormData]);
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      render(
        <Provider store={store}>
          <MainRoute onOpenUncontrolled={vi.fn()} onOpenControlled={vi.fn()} />
        </Provider>
      );

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(dispatchSpy).toHaveBeenCalledWith({ type: 'form/clearHighlight' });
      vi.useRealTimers();
    });

    it('should not set timer when no highlightedId', () => {
      vi.useFakeTimers();
      const store = createTestStore([{ ...mockFormData, id: 'different-id' }]);
      store.dispatch({ type: 'form/clearHighlight' });
      const dispatchSpy = vi.spyOn(store, 'dispatch');

      render(
        <Provider store={store}>
          <MainRoute onOpenUncontrolled={vi.fn()} onOpenControlled={vi.fn()} />
        </Provider>
      );

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(dispatchSpy).not.toHaveBeenCalledWith({
        type: 'form/clearHighlight',
      });
      vi.useRealTimers();
    });
  });

  describe('image compression', () => {
    it('should compress images and show compressed version', async () => {
      renderWithStore([mockFormData]);

      await waitFor(() => {
        expect(mockCompressImage).toHaveBeenCalledWith(
          'data:image/jpeg;base64,testImageData',
          200,
          0.6
        );
      });

      await waitFor(() => {
        expect(screen.getByAltText('User upload')).toHaveAttribute(
          'src',
          'data:image/jpeg;base64,compressed'
        );
      });
    });

    it('should show compression loading state', () => {
      renderWithStore([mockFormData]);
      expect(screen.getByText('Compressing...')).toBeInTheDocument();
    });

    it('should handle compression error', async () => {
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      mockCompressImage.mockRejectedValue(new Error('Compression failed'));

      renderWithStore([mockFormData]);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to compress image:',
          expect.objectContaining({ message: 'Compression failed' })
        );
      });

      await waitFor(() => {
        expect(screen.getByAltText('User upload')).toHaveAttribute(
          'src',
          'data:image/jpeg;base64,testImageData'
        );
      });

      consoleErrorSpy.mockRestore();
    });

    it('should skip compression for already compressed images', async () => {
      renderWithStore([mockFormData, { ...mockFormData, id: 'test-id-2' }]);

      await waitFor(() => {
        expect(mockCompressImage).toHaveBeenCalledTimes(2);
      });

      expect(mockCompressImage).toHaveBeenCalledTimes(2);
    });
  });

  describe('button interactions', () => {
    it('should call onOpenControlled when controlled form button clicked', async () => {
      const user = userEvent.setup();
      const mockOnOpenControlled = vi.fn();
      const store = createTestStore();

      render(
        <Provider store={store}>
          <MainRoute
            onOpenUncontrolled={vi.fn()}
            onOpenControlled={mockOnOpenControlled}
          />
        </Provider>
      );

      await user.click(
        screen.getByRole('button', { name: 'Open Controlled Form' })
      );
      expect(mockOnOpenControlled).toHaveBeenCalledTimes(1);
    });

    it('should call onOpenUncontrolled when uncontrolled form button clicked', async () => {
      const user = userEvent.setup();
      const mockOnOpenUncontrolled = vi.fn();
      const store = createTestStore();

      render(
        <Provider store={store}>
          <MainRoute
            onOpenUncontrolled={mockOnOpenUncontrolled}
            onOpenControlled={vi.fn()}
          />
        </Provider>
      );

      await user.click(
        screen.getByRole('button', { name: 'Open Uncontrolled Form' })
      );
      expect(mockOnOpenUncontrolled).toHaveBeenCalledTimes(1);
    });
  });
});
