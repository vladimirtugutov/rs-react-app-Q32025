import Link from 'next/link';
import SearchInput from '../Search/SearchInput';
import SearchButton from '../Search/SearchButton';
import { RefreshButton } from './RefreshButton';
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
        <RefreshButton
          isLoading={isLoading}
          onRefresh={onManualRefresh ?? (() => {})}
        />
      </div>
      <nav className="navigation">
        <Link href="/about">About</Link>
      </nav>
    </div>
  );
};

export default TopControls;
