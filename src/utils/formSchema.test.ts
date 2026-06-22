// src/utils/formSchema.test.ts
import { describe, it, expect } from 'vitest';
import { formSchema } from './formSchema';

const validData = {
  name: 'John',
  age: 25,
  email: 'john@example.com',
  password: 'Password1!',
  confirmPassword: 'Password1!',
  gender: 'male' as const,
  termsAccepted: true,
  country: 'USA',
  imageBase64: 'data:image/jpeg;base64,test',
};

describe('formSchema', () => {
  it('should validate correct data successfully', () => {
    const result = formSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when name starts with lowercase', () => {
    const result = formSchema.safeParse({ ...validData, name: 'john' });
    expect(result.success).toBe(false);
  });

  it('should fail when age is not positive', () => {
    const result = formSchema.safeParse({ ...validData, age: -1 });
    expect(result.success).toBe(false);
  });

  it('should fail with invalid email', () => {
    const result = formSchema.safeParse({ ...validData, email: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('should fail when password is too short', () => {
    const result = formSchema.safeParse({ ...validData, password: 'Ab1!', confirmPassword: 'Ab1!' });
    expect(result.success).toBe(false);
  });

  it('should fail when password lacks uppercase letter', () => {
    const result = formSchema.safeParse({ ...validData, password: 'password1!', confirmPassword: 'password1!' });
    expect(result.success).toBe(false);
  });

  it('should fail when password lacks number', () => {
    const result = formSchema.safeParse({ ...validData, password: 'Password!', confirmPassword: 'Password!' });
    expect(result.success).toBe(false);
  });

  it('should fail when password lacks special character', () => {
    const result = formSchema.safeParse({ ...validData, password: 'Password1', confirmPassword: 'Password1' });
    expect(result.success).toBe(false);
  });

  it('should fail when passwords do not match', () => {
    const result = formSchema.safeParse({ ...validData, confirmPassword: 'Different1!' });
    expect(result.success).toBe(false);
  });

  it('should fail when gender is invalid', () => {
    const result = formSchema.safeParse({ ...validData, gender: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('should fail when terms are not accepted', () => {
    const result = formSchema.safeParse({ ...validData, termsAccepted: false });
    expect(result.success).toBe(false);
  });

  it('should fail when country is empty', () => {
    const result = formSchema.safeParse({ ...validData, country: '' });
    expect(result.success).toBe(false);
  });

  it('should fail when image is missing', () => {
    const result = formSchema.safeParse({ ...validData, imageBase64: '' });
    expect(result.success).toBe(false);
  });
});