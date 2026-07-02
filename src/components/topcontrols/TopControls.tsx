import { Link } from '@/i18n/navigation';
import { SearchForm } from '../Search/SearchForm';
import { RefreshButton } from './RefreshButton';
import './TopControls.css';

type TopControlsProps = {
  initialQuery?: string;
};

export const TopControls = ({ initialQuery }: TopControlsProps) => (
  <div className="top-controls">
    <div className="search-controls-wrapper">
      <SearchForm initialQuery={initialQuery} />
      <RefreshButton />
    </div>
    <nav className="navigation">
      <Link href="/about">About</Link>
    </nav>
  </div>
);

export default TopControls;
