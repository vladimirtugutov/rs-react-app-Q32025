import { describe, it, expect } from 'vitest';
import { validateEmail } from './validateEmail';

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