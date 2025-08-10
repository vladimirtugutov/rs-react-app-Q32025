import { Link } from 'react-router-dom';
import SearchInput from '../Search/SearchInput';
import SearchButton from '../Search/SearchButton';
import RefreshButton from './RefreshButton';
import './TopControls.css';

export const TopControls = () => {
  return (
    <div className="top-controls">
      <div className="search-controls">
        <SearchInput />
        <SearchButton />
        <RefreshButton />
      </div>
      <nav className="navigation">
        <Link to="/about">About</Link>
      </nav>
    </div>
  );
};

export default TopControls;
