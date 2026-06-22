import { Link } from '@/i18n/navigation';
import { SearchForm } from '../Search/SearchForm';
import { RefreshButton } from './RefreshButton';
import './TopControls.css';

type TopControlsProps = {
  locale: string;
  initialQuery?: string;
};

export const TopControls = ({ locale, initialQuery }: TopControlsProps) => (
  <div className="top-controls">
    <div className="search-controls-wrapper">
      <SearchForm locale={locale} initialQuery={initialQuery} />
      <RefreshButton />
    </div>
    <nav className="navigation">
      <Link href="/about">About</Link>
    </nav>
  </div>
);

export default TopControls;
