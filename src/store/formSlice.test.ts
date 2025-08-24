import { describe, it, expect, vi, beforeEach } from 'vitest';
import formReducer, {
  addFormData,
  clearHighlight,
  clearFormData,
  FormData,
  FormState,
} from './formSlice';

let mockDateNow = 1000000;
vi.spyOn(Date, 'now').mockImplementation(() => mockDateNow++);

describe('formSlice', () => {
  const initialState: FormState = {
    formData: [],
    highlightedId: null,
  };

  const mockFormData: FormData = {
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

  beforeEach(() => {
    mockDateNow = 1000000;
  });

  describe('reducers', () => {
    it('should return the initial state', () => {
      expect(formReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle addFormData', () => {
      const action = addFormData(mockFormData);
      const result = formReducer(initialState, action);

      expect(result.formData).toHaveLength(1);
      expect(result.formData[0].name).toBe('John Doe');
      expect(result.formData[0].age).toBe(25);
      expect(result.formData[0].email).toBe('john@example.com');
      expect(result.highlightedId).toBeTruthy();
      expect(result.formData[0].id).toBe('1000000');
    });

    it('should add multiple form entries', () => {
      const firstEntry = { ...mockFormData, name: 'John' };
      const secondEntry = { ...mockFormData, name: 'Jane' };

      let state = formReducer(initialState, addFormData(firstEntry));
      state = formReducer(state, addFormData(secondEntry));

      expect(state.formData).toHaveLength(2);
      expect(state.formData[0].name).toBe('John');
      expect(state.formData[1].name).toBe('Jane');
    });

    it('should handle clearHighlight', () => {
      const stateWithHighlight: FormState = {
        formData: [{ ...mockFormData, id: '123' }],
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

    it('should generate unique IDs for form entries', () => {
      const firstResult = formReducer(initialState, addFormData(mockFormData));
      const secondResult = formReducer(firstResult, addFormData(mockFormData));

      expect(firstResult.formData[0].id).toBe('1000000');
      expect(secondResult.formData[1].id).toBe('1000001');
      expect(firstResult.formData[0].id).not.toBe(secondResult.formData[1].id);
    });

    it('should update highlightedId when adding new data', () => {
      const result = formReducer(initialState, addFormData(mockFormData));
      const newId = result.formData[0].id;

      expect(result.highlightedId).toBe(newId);
      expect(result.highlightedId).toBe('1000000');
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
