import { describe, it, expect } from 'vitest';
import { router } from './router';
describe('Router Configuration', () => {
  it('should create a browser router instance successfully', () => {
    expect(router).toBeDefined();
    expect(router.routes).toBeDefined();

    const rootRoute = router.routes.find((route) => route.path === '/');
    expect(rootRoute).toBeDefined();
  });
});
