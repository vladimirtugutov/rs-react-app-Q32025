import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppRoutes } from '../constants/routes';
import { About } from '../about/About';
import { NotFound } from '../not-found/NotFound';
import { ValidatedMainLayout } from './ValidatedMainLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/1" replace />,
  },
  {
    path: AppRoutes.ABOUT,
    element: <About />,
  },
  {
    path: AppRoutes.MAIN,
    element: <ValidatedMainLayout />,
  },
  {
    path: AppRoutes.NOT_FOUND,
    element: <NotFound />,
  },
]);
