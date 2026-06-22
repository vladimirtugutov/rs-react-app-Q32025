import { Link } from '@/i18n/navigation';
import { SearchForm } from '../Search/SearchForm';
import './TopControls.css';

type TopControlsProps = {
  locale: string;
  initialQuery?: string;
  isLoading: boolean;
  onManualRefresh?: () => void;
};

export const TopControls = ({
  locale,
  initialQuery,
  onManualRefresh,
  isLoading,
}: TopControlsProps) => (
  <div className="top-controls">
    <SearchForm
      locale={locale}
      initialQuery={initialQuery}
      isLoading={isLoading}
      onManualRefresh={onManualRefresh}
    />
    <nav className="navigation">
      <Link href="/about">About</Link>
    </nav>
  </div>
);

export default TopControls;
