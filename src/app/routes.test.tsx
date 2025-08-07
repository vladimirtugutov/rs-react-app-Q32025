import { describe, it, expect } from 'vitest';
import React from 'react';
import { routes, RouteConfig } from './routes';
import { AppRoutes } from '../constants/routes';
import { About } from '../pages/about/About';
import { NotFound } from '../pages/not-found/NotFound';
import { ValidatedMainLayout } from './ValidatedMainLayout';

describe('routes configuration', () => {
  describe('Route structure', () => {
    it('should have correct number of routes', () => {
      expect(routes).toHaveLength(3);
    });

    it('should have correct RouteConfig type structure', () => {
      routes.forEach((route: RouteConfig) => {
        expect(route).toHaveProperty('path');
        expect(route).toHaveProperty('element');
        expect(typeof route.path).toBe('string');
        expect(React.isValidElement(route.element)).toBe(true);
      });
    });

    it('should export RouteConfig type correctly', () => {
      const testRoute: RouteConfig = {
        path: '/test',
        element: <div>Test</div>,
      };

      expect(testRoute.path).toBe('/test');
      expect(React.isValidElement(testRoute.element)).toBe(true);
    });
  });

  describe('Route paths', () => {
    it('should have correct path for About route', () => {
      const aboutRoute = routes.find((route) => route.path === AppRoutes.ABOUT);
      expect(aboutRoute).toBeDefined();
      expect(aboutRoute?.path).toBe(AppRoutes.ABOUT);
    });

    it('should have correct path for Main route', () => {
      const mainRoute = routes.find((route) => route.path === AppRoutes.MAIN);
      expect(mainRoute).toBeDefined();
      expect(mainRoute?.path).toBe(AppRoutes.MAIN);
    });

    it('should have correct path for NotFound route', () => {
      const notFoundRoute = routes.find(
        (route) => route.path === AppRoutes.NOT_FOUND
      );
      expect(notFoundRoute).toBeDefined();
      expect(notFoundRoute?.path).toBe(AppRoutes.NOT_FOUND);
    });

    it('should use constants from AppRoutes', () => {
      const pathsFromRoutes = routes.map((route) => route.path);
      const expectedPaths = [
        AppRoutes.ABOUT,
        AppRoutes.MAIN,
        AppRoutes.NOT_FOUND,
      ];

      expect(pathsFromRoutes).toEqual(expect.arrayContaining(expectedPaths));
    });
  });

  describe('Route elements', () => {
    it('should have About component for About route', () => {
      const aboutRoute = routes.find((route) => route.path === AppRoutes.ABOUT);
      expect(aboutRoute?.element.type).toBe(About);
    });

    it('should have ValidatedMainLayout component for Main route', () => {
      const mainRoute = routes.find((route) => route.path === AppRoutes.MAIN);
      expect(mainRoute?.element.type).toBe(ValidatedMainLayout);
    });

    it('should have NotFound component for NotFound route', () => {
      const notFoundRoute = routes.find(
        (route) => route.path === AppRoutes.NOT_FOUND
      );
      expect(notFoundRoute?.element.type).toBe(NotFound);
    });

    it('should have valid React elements for all routes', () => {
      routes.forEach((route) => {
        expect(React.isValidElement(route.element)).toBe(true);
      });
    });
  });

  describe('Route mapping completeness', () => {
    it('should contain all required routes', () => {
      const requiredRoutes = [
        AppRoutes.ABOUT,
        AppRoutes.MAIN,
        AppRoutes.NOT_FOUND,
      ];
      const actualPaths = routes.map((route) => route.path);

      requiredRoutes.forEach((requiredRoute) => {
        expect(actualPaths).toContain(requiredRoute);
      });
    });

    it('should not have duplicate routes', () => {
      const paths = routes.map((route) => route.path);
      const uniquePaths = [...new Set(paths)];

      expect(paths).toHaveLength(uniquePaths.length);
    });

    it('should not have empty paths', () => {
      routes.forEach((route) => {
        expect(route.path).not.toBe('');
        expect(route.path).not.toBeNull();
        expect(route.path).not.toBeUndefined();
      });
    });
  });

  describe('Integration with AppRoutes constants', () => {
    it('should match AppRoutes.ABOUT constant', () => {
      const aboutRoute = routes.find((route) => route.path === AppRoutes.ABOUT);
      expect(aboutRoute).toBeTruthy();
    });

    it('should match AppRoutes.MAIN constant', () => {
      const mainRoute = routes.find((route) => route.path === AppRoutes.MAIN);
      expect(mainRoute).toBeTruthy();
    });

    it('should match AppRoutes.NOT_FOUND constant', () => {
      const notFoundRoute = routes.find(
        (route) => route.path === AppRoutes.NOT_FOUND
      );
      expect(notFoundRoute).toBeTruthy();
    });

    it('should not hardcode paths', () => {
      const validRouteValues = Object.values(AppRoutes) as string[];

      routes.forEach((route) => {
        const isValidConstant = validRouteValues.includes(route.path);
        expect(isValidConstant).toBe(true);
      });
    });
  });

  describe('Route configuration consistency', () => {
    it('should have consistent route structure', () => {
      const expectedStructure = {
        path: 'string',
        element: 'object',
      };

      routes.forEach((route) => {
        expect(typeof route.path).toBe(expectedStructure.path);
        expect(typeof route.element).toBe(expectedStructure.element);
        expect(route.element).not.toBeNull();
      });
    });

    it('should have routes in expected order', () => {
      const expectedOrder = [
        AppRoutes.ABOUT,
        AppRoutes.MAIN,
        AppRoutes.NOT_FOUND,
      ];
      const actualOrder = routes.map((route) => route.path);

      expect(actualOrder).toEqual(expectedOrder);
    });
  });

  describe('Component imports verification', () => {
    it('should properly import About component', () => {
      expect(About).toBeDefined();
      expect(typeof About).toBe('function');
    });

    it('should properly import NotFound component', () => {
      expect(NotFound).toBeDefined();
      expect(typeof NotFound).toBe('function');
    });

    it('should properly import ValidatedMainLayout component', () => {
      expect(ValidatedMainLayout).toBeDefined();
      expect(typeof ValidatedMainLayout).toBe('function');
    });
  });

  describe('Error handling', () => {
    it('should handle invalid route access gracefully', () => {
      const invalidRoute = routes.find(
        (route) => route.path === '/invalid-path'
      );
      expect(invalidRoute).toBeUndefined();
    });

    it('should not throw when accessing route elements', () => {
      expect(() => {
        routes.forEach((route) => {
          const element = route.element;
          expect(element).toBeDefined();
        });
      }).not.toThrow();
    });
  });

  describe('Type safety', () => {
    it('should satisfy RouteConfig type constraints', () => {
      const testConfig: RouteConfig = {
        path: '/test',
        element: <div>Test Component</div>,
      };

      expect(testConfig.path).toBeDefined();
      expect(testConfig.element).toBeDefined();
    });

    it('should ensure all routes conform to RouteConfig type', () => {
      routes.forEach((route: RouteConfig) => {
        expect(route.path).toBeDefined();
        expect(route.element).toBeDefined();
      });
    });
  });
});
