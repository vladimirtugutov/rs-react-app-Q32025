import { describe, it, expect } from 'vitest';
import { validateAge } from './validateAge';

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