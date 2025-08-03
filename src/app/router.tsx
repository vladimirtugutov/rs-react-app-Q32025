import { createBrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../constants/routes';
import { About } from '../pages/about/About';
import { NotFound } from '../pages/not-found/NotFound';
import { ValidatedMainLayout } from './ValidatedMainLayout';

export const router = createBrowserRouter([
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
