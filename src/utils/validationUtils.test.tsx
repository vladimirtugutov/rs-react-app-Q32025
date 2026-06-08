import { describe, it, expect } from 'vitest';
import { validateName, validateEmail, validateAge } from './validationUtils';

describe('validationUtils', () => {
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

  describe('validateEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('john+doe@gmail.com')).toBe(true);
    });

    it('should return false for missing @', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test.domain.com')).toBe(false);
    });

    it('should return false for empty local or domain part', () => {
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
    });

    it('should return false for empty email', () => {
      expect(validateEmail('')).toBe(false);
    });

    it('should return false for emails without domain extension', () => {
      expect(validateEmail('test@domain')).toBe(false);
    });

    it('should return false for multiple @ symbols', () => {
      expect(validateEmail('test@@example.com')).toBe(false);
      expect(validateEmail('te@st@example.com')).toBe(false);
    });

    it('should handle complex valid emails', () => {
      expect(validateEmail('test.email.with+symbol@example.com')).toBe(true);
      expect(validateEmail('x@example.co.uk')).toBe(true);
    });
  });

  describe('validateAge', () => {
    it('should return true for positive ages', () => {
      expect(validateAge(1)).toBe(true);
      expect(validateAge(25)).toBe(true);
    });

    it('should return false for zero age', () => {
      expect(validateAge(0)).toBe(false);
    });

    it('should return false for negative ages', () => {
      expect(validateAge(-1)).toBe(false);
    });

    it('should handle decimal ages', () => {
      expect(validateAge(25.5)).toBe(true);
      expect(validateAge(-0.1)).toBe(false);
    });
  });
});
