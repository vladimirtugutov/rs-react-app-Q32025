import React from 'react';
import { Navigate } from 'react-router-dom';
import { AppRoutes } from '../constants/routes';
import { About } from '../about/About';
import { NotFound } from '../not-found/NotFound';
import { ValidatedMainLayout } from './ValidatedMainLayout';

export type RouteConfig = {
  path: string;
  element: React.ReactNode;
};

export const routes: RouteConfig[] = [
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
];
