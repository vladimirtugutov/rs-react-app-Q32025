import { describe, it, expect } from 'vitest';
import formReducer, {
  addFormData,
  clearHighlight,
  clearFormData,
  FormState,
} from './formSlice';
import type { FormSubmission } from '../utils/formSchema';

describe('formSlice', () => {
  const initialState: FormState = {
    formData: [],
    highlightedId: null,
  };

  const mockFormData: FormSubmission = {
    id: 'test-id',
    name: 'John Doe',
    age: 25,
    email: 'john@example.com',
    password: 'password123',
    gender: 'male',
    termsAccepted: true,
    imageBase64: 'data:image/jpeg;base64,test',
    country: 'United States',
  };

  describe('reducers', () => {
    it('should return the initial state', () => {
      expect(formReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle addFormData', () => {
      const result = formReducer(initialState, addFormData(mockFormData));

      expect(result.formData).toHaveLength(1);
      expect(result.formData[0].name).toBe('John Doe');
      expect(result.formData[0].age).toBe(25);
      expect(result.formData[0].email).toBe('john@example.com');
      expect(result.formData[0].id).toBe('test-id');
      expect(result.highlightedId).toBe('test-id');
    });

    it('should add multiple form entries', () => {
      const firstEntry = { ...mockFormData, id: 'id-1', name: 'John' };
      const secondEntry = { ...mockFormData, id: 'id-2', name: 'Jane' };

      let state = formReducer(initialState, addFormData(firstEntry));
      state = formReducer(state, addFormData(secondEntry));

      expect(state.formData).toHaveLength(2);
      expect(state.formData[0].name).toBe('John');
      expect(state.formData[1].name).toBe('Jane');
    });

    it('should update highlightedId to last added entry', () => {
      const firstEntry = { ...mockFormData, id: 'id-1' };
      const secondEntry = { ...mockFormData, id: 'id-2' };

      let state = formReducer(initialState, addFormData(firstEntry));
      state = formReducer(state, addFormData(secondEntry));

      expect(state.highlightedId).toBe('id-2');
    });

    it('should handle clearHighlight', () => {
      const stateWithHighlight: FormState = {
        formData: [mockFormData],
        highlightedId: 'test-id',
      };

      const result = formReducer(stateWithHighlight, clearHighlight());

      expect(result.highlightedId).toBeNull();
      expect(result.formData).toHaveLength(1);
    });

    it('should handle clearFormData', () => {
      const stateWithData: FormState = {
        formData: [mockFormData, { ...mockFormData, id: 'test-id-2' }],
        highlightedId: 'test-id',
      };

      const result = formReducer(stateWithData, clearFormData());

      expect(result.formData).toEqual([]);
      expect(result.highlightedId).toBeNull();
    });
  });

  describe('action creators', () => {
    it('should create addFormData action', () => {
      const action = addFormData(mockFormData);

      expect(action.type).toBe('form/addFormData');
      expect(action.payload).toEqual(mockFormData);
    });

    it('should create clearHighlight action', () => {
      const action = clearHighlight();

      expect(action.type).toBe('form/clearHighlight');
      expect(action.payload).toBeUndefined();
    });

    it('should create clearFormData action', () => {
      const action = clearFormData();

      expect(action.type).toBe('form/clearFormData');
      expect(action.payload).toBeUndefined();
    });
  });
});
