import { describe, it, expect } from 'vitest';
import { getPasswordStrengthClass } from './getPasswordStrengthClass';

describe('getPasswordStrengthClass', () => {
  it('should convert "Very Weak" to "strength-very-weak"', () => {
    expect(getPasswordStrengthClass('Very Weak')).toBe('strength-very-weak');
  });

  it('should convert "Weak" to "strength-weak"', () => {
    expect(getPasswordStrengthClass('Weak')).toBe('strength-weak');
  });

  it('should convert "Medium" to "strength-medium"', () => {
    expect(getPasswordStrengthClass('Medium')).toBe('strength-medium');
  });

  it('should convert "Strong" to "strength-strong"', () => {
    expect(getPasswordStrengthClass('Strong')).toBe('strength-strong');
  });

  it('should convert "Very Strong" to "strength-very-strong"', () => {
    expect(getPasswordStrengthClass('Very Strong')).toBe('strength-very-strong');
  });
});