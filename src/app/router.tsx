import { createBrowserRouter, Navigate } from 'react-router-dom';
import { About } from '../about/About';
import { NotFound } from '../not-found/NotFound';
import { ValidatedMainLayout } from './ValidatedMainLayout';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <ValidatedMainLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/1" replace />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: ':page',
        children: [
          { index: true, element: null },
          { path: ':detailsId', element: null },
        ],
      },
      {
        path: 'not-found',
        element: <NotFound />,
      },
      {
        path: '*',
        element: <Navigate to="/not-found" replace />,
      },
    ],
  },
]);
