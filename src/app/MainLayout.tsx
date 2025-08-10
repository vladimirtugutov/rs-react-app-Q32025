import { useParams, useNavigate, Outlet } from 'react-router-dom';
import { TopControls } from '../components/Topcontrols/TopControls';
import { MainContent } from './MainContent';
import { SearchProvider } from '../components/Search/SearchProvider';
import './App.css';

export const MainLayout = () => {
  const { page = '1', detailsId } = useParams();
  const navigate = useNavigate();

  const currentPage = parseInt(page, 10);

  return (
    <SearchProvider
      currentPage={currentPage}
      detailsId={detailsId}
      navigate={navigate}
    >
      {({
        isLoading,
        error,
        results,
        currentPage,
        totalPages,
        onPageChange,
      }) => (
        <div className="main-content">
          <div className="left-section">
            <TopControls />
            <MainContent
              isLoading={isLoading}
              error={error}
              results={results}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          </div>
          <div className="right-section">
            <Outlet context={{ results }} />
          </div>
        </div>
      )}
    </SearchProvider>
  );
};
