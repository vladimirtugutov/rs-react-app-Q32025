import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';

import selectedItemsReducer from '../store/selectedItemsSlice';
import { AppRoutes } from '../constants/routes';

vi.mock('../../pages/about/About', () => ({
  About: () => <div data-testid="about-page">About Page</div>,
}));

vi.mock('../../pages/not-found/NotFound', () => ({
  NotFound: () => <div data-testid="not-found-page">Not Found Page</div>,
}));

vi.mock('../ValidatedMainLayout', () => ({
  ValidatedMainLayout: () => <div data-testid="main-layout">Main Layout</div>,
}));

vi.mock('../../components/Search/SearchProvider', () => ({
  SearchProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="search-provider">{children}</div>
  ),
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
  });
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore();
  return <Provider store={store}>{children}</Provider>;
};

const createTestRouter = (initialPath: string) => {
  return createMemoryRouter(
    [
      {
        path: AppRoutes.ABOUT,
        element: <div data-testid="about-page">About Page</div>,
      },
      {
        path: AppRoutes.MAIN,
        element: <div data-testid="main-layout">Main Layout</div>,
      },
      {
        path: AppRoutes.NOT_FOUND,
        element: <div data-testid="not-found-page">Not Found Page</div>,
      },
    ],
    {
      initialEntries: [initialPath],
    }
  );
};

describe('Router Configuration', () => {
  describe('Route Navigation', () => {
    it('should navigate to About page', async () => {
      const router = createTestRouter(AppRoutes.ABOUT);

      render(
        <TestWrapper>
          <RouterProvider router={router} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('about-page')).toBeInTheDocument();
      });
    });

    it('should navigate to Main page with root path', async () => {
      const router = createTestRouter('/');

      render(
        <TestWrapper>
          <RouterProvider router={router} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      });
    });

    it('should navigate to Main page with page parameter', async () => {
      const router = createTestRouter('/2');

      render(
        <TestWrapper>
          <RouterProvider router={router} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      });
    });

    it('should navigate to Main page with page and detailsId parameters', async () => {
      const router = createTestRouter('/1/book123');

      render(
        <TestWrapper>
          <RouterProvider router={router} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      });
    });
  });

  describe('Route Constants Integration', () => {
    it('should use AppRoutes constants correctly', () => {
      expect(AppRoutes.MAIN).toBe('/:page?/:detailsId?');
      expect(AppRoutes.ABOUT).toBe('/about');
      expect(AppRoutes.NOT_FOUND).toBe('*');

      expect(typeof AppRoutes.MAIN).toBe('string');
      expect(typeof AppRoutes.ABOUT).toBe('string');
      expect(typeof AppRoutes.NOT_FOUND).toBe('string');
    });

    it('should handle main route with different parameter combinations', async () => {
      const testCases = [
        { path: '/', expectedTestId: 'main-layout' },
        { path: '/1', expectedTestId: 'main-layout' },
        { path: '/2', expectedTestId: 'main-layout' },
        { path: '/1/book123', expectedTestId: 'main-layout' },
        { path: '/5/details456', expectedTestId: 'main-layout' },
        { path: '/random-page', expectedTestId: 'main-layout' },
        { path: '/anything', expectedTestId: 'main-layout' },
      ];

      for (const testCase of testCases) {
        const router = createTestRouter(testCase.path);

        const { unmount } = render(
          <TestWrapper>
            <RouterProvider router={router} />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(
            screen.getByTestId(testCase.expectedTestId)
          ).toBeInTheDocument();
        });

        unmount();
      }
    });

    it('should handle about route correctly', async () => {
      const router = createTestRouter('/about');

      render(
        <TestWrapper>
          <RouterProvider router={router} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('about-page')).toBeInTheDocument();
      });
    });
  });

  describe('Parameterized Routes', () => {
    it('should handle optional page parameter', async () => {
      const pageRoutes = ['/', '/1', '/2', '/10', '/999'];

      for (const route of pageRoutes) {
        const router = createTestRouter(route);

        const { unmount } = render(
          <TestWrapper>
            <RouterProvider router={router} />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(screen.getByTestId('main-layout')).toBeInTheDocument();
        });

        unmount();
      }
    });

    it('should handle optional detailsId parameter', async () => {
      const detailRoutes = [
        '/1/book123',
        '/2/item456',
        '/5/details789',
        '/10/abc123def',
      ];

      for (const route of detailRoutes) {
        const router = createTestRouter(route);

        const { unmount } = render(
          <TestWrapper>
            <RouterProvider router={router} />
          </TestWrapper>
        );

        await waitFor(() => {
          expect(screen.getByTestId('main-layout')).toBeInTheDocument();
        });

        unmount();
      }
    });
  });

  describe('Router Integration', () => {
    it('should work with Redux store', async () => {
      const router = createTestRouter('/');
      const store = createTestStore();

      render(
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      });

      expect(store.getState()).toBeDefined();
      expect(store.getState().selectedItems).toBeDefined();
    });

    it('should handle store updates correctly', async () => {
      const router = createTestRouter('/');
      const store = createTestStore();

      render(
        <Provider store={store}>
          <RouterProvider router={router} />
        </Provider>
      );

      expect(store.getState().selectedItems.items).toHaveLength(0);

      await waitFor(() => {
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      });
    });
  });

  describe('Route Error Handling', () => {
    it('should handle router errors gracefully', async () => {
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const router = createTestRouter('/');

      expect(() => {
        render(
          <TestWrapper>
            <RouterProvider router={router} />
          </TestWrapper>
        );
      }).not.toThrow();

      consoleSpy.mockRestore();
    });

    it('should handle flexible routing correctly', async () => {
      const router = createTestRouter('/some-random-path');

      render(
        <TestWrapper>
          <RouterProvider router={router} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      });
    });
  });

  describe('Specific Route Behavior', () => {
    it('should distinguish between about and main routes', async () => {
      const aboutRouter = createTestRouter('/about');
      const { unmount: unmountAbout } = render(
        <TestWrapper>
          <RouterProvider router={aboutRouter} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('about-page')).toBeInTheDocument();
      });

      unmountAbout();

      const mainRouter = createTestRouter('/not-about');
      render(
        <TestWrapper>
          <RouterProvider router={mainRouter} />
        </TestWrapper>
      );

      await waitFor(() => {
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      });
    });
  });
});
