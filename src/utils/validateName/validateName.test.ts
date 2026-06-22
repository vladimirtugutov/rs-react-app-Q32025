import { describe, it, expect } from 'vitest';
import { validateName } from './validateName';

describe('validateName', () => {
  it('should return true for names starting with uppercase letter', () => {
    expect(validateName('John')).toBe(true);
  });

  it('should return false for names starting with lowercase letter', () => {
    expect(validateName('john')).toBe(false);
  });

  it('should return false for empty names', () => {
    expect(validateName('')).toBe(false);
  });

  it('should return false for names starting with numbers', () => {
    expect(validateName('1John')).toBe(false);
  });

  it('should return false for names starting with special characters', () => {
    expect(validateName('@John')).toBe(false);
    expect(validateName(' John')).toBe(false);
  });

  it('should handle names with spaces correctly', () => {
    expect(validateName('John Doe')).toBe(true);
  });
});