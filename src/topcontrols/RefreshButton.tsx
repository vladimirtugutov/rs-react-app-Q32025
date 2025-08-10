import { useState } from 'react';
import { useCacheInvalidation } from '../../hooks/useCacheInvalidation';

export const RefreshButton = () => {
  const { refreshBooks } = useCacheInvalidation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      refreshBooks();
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleRefresh}
      disabled={isRefreshing}
      title="Refresh results"
    >
      {isRefreshing ? 'Refreshing...' : 'Refresh'}
    </button>
  );
};

export default RefreshButton;
