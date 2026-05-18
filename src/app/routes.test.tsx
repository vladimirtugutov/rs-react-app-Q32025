import { describe, it, expect } from 'vitest';
import { routes } from './routes';

describe('Routes Configuration', () => {
  it('should define an array of routes with paths', () => {
    expect(Array.isArray(routes)).toBe(true);
    expect(routes.length).toBeGreaterThan(0);

    expect(routes[0]).toHaveProperty('path');
  });
});
