import React from 'react';
import { useParams } from 'react-router-dom';
import { NotFound } from '../not-found/NotFound';
import { MainLayout } from './MainLayout';

export const ValidatedMainLayout: React.FC = () => {
  const { page = '1' } = useParams();

  const pageNum = Number(page);
  if (!Number.isInteger(pageNum) || pageNum < 1) {
    return <NotFound />;
  }

  return <MainLayout />;
};
