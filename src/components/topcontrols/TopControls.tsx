import { Link } from 'react-router-dom';
import SearchInput from '../Search/SearchInput';
import SearchButton from '../Search/SearchButton';
import { RefreshButton } from './RefreshButton';
import { AppRoutes } from '../../constants/routes';
import './TopControls.css';

type TopControlsProps = {
  isLoading: boolean;
  onManualRefresh?: () => void;
};

export const TopControls = ({
  onManualRefresh,
  isLoading,
}: TopControlsProps) => {
  return (
    <div className="top-controls">
      <div className="search-controls">
        <SearchInput />
        <SearchButton />
        <RefreshButton isLoading={isLoading} onRefresh={onManualRefresh} />
      </div>
      <nav className="navigation">
        <Link to={AppRoutes.ABOUT}>About</Link>
      </nav>
    </div>
  );
};

export default TopControls;
