import { createBrowserRouter } from 'react-router-dom';
import { AppRoutes } from '../constants/routes';
import { About } from '../pages/about/About';
import { NotFound } from '../pages/not-found/NotFound';
import { ValidatedMainLayout } from './ValidatedMainLayout';
import { BookDetails } from '../pages/book-details/BookDetails';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ValidatedMainLayout />,
    children: [
      {
        path: ':page?',
        children: [
          { index: true, element: null },
          { path: ':detailsId', element: <BookDetails /> },
        ],
      },
      {
        path: AppRoutes.ABOUT,
        element: <About />,
      },
      {
        path: AppRoutes.NOT_FOUND,
        element: <NotFound />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);
