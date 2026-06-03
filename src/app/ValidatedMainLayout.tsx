import { useParams } from 'react-router-dom';
import { NotFound } from '../pages/not-found/NotFound';
import { MainLayout } from './MainLayout';

export const ValidatedMainLayout = () => {
  const { page = '1' } = useParams();

  const pageNum = Number(page);

  return !Number.isInteger(pageNum) || pageNum < 1 ? (
    <NotFound />
  ) : (
    <MainLayout />
  );
};
