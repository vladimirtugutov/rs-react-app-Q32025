import { Link } from 'react-router-dom';
import SearchInput from '../Search/SearchInput';
import SearchButton from '../Search/SearchButton';
import { AppRoutes } from '../../constants/routes';

function TopControls() {
  return (
    <div className="top-controls">
      <div className="search-controls">
        <SearchInput />
        <SearchButton />
      </div>
      <nav className="navigation">
        <Link to={AppRoutes.ABOUT}>About</Link>
      </nav>
    </div>
  );
}

export default TopControls;
