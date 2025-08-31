import { describe, it, expect } from 'vitest';
import { calculatePasswordStrength } from './passwordUtils';

describe('passwordUtils', () => {
  describe('calculatePasswordStrength', () => {
    it('should return Very Weak for empty password', () => {
      expect(calculatePasswordStrength('')).toBe('Very Weak');
    });

    it('should return Very Weak for very short password', () => {
      expect(calculatePasswordStrength('123')).toBe('Very Weak');
      expect(calculatePasswordStrength('a')).toBe('Very Weak');
    });

    it('should return Weak for password with only length requirement', () => {
      expect(calculatePasswordStrength('password')).toBe('Weak');
      expect(calculatePasswordStrength('123456')).toBe('Weak');
    });

    it('should return Medium for password with 3 criteria', () => {
      expect(calculatePasswordStrength('Password')).toBe('Medium');
      expect(calculatePasswordStrength('password1')).toBe('Medium');
    });

    it('should return Strong for password with 4 criteria', () => {
      expect(calculatePasswordStrength('Password1')).toBe('Strong');
      expect(calculatePasswordStrength('PASSWORD1!')).toBe('Strong');
    });

    it('should return Very Strong for password with all 5 criteria', () => {
      expect(calculatePasswordStrength('Password1!')).toBe('Very Strong');
      expect(calculatePasswordStrength('MyP@ssw0rd')).toBe('Very Strong');
    });

    it('should handle edge cases with special characters', () => {
      expect(calculatePasswordStrength('Pass1@')).toBe('Very Strong');
      expect(calculatePasswordStrength('test#$%')).toBe('Medium');
    });
  });
});
