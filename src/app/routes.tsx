import React from 'react';
import { AppRoutes } from '../constants/routes';
import { About } from '../pages/about/About';
import { NotFound } from '../pages/not-found/NotFound';
import { ValidatedMainLayout } from './ValidatedMainLayout';

export type RouteConfig = {
  path: string;
  element: React.ReactNode;
};

export const routes: RouteConfig[] = [
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
];
