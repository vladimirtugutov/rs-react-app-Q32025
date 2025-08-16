type RefreshButtonProps = {
  onRefresh: () => void;
  isLoading: boolean;
};

export const RefreshButton = ({ onRefresh, isLoading }: RefreshButtonProps) => {
  return (
    <button
      onClick={onRefresh}
      disabled={isLoading}
      className="top-controls-button"
    >
      {isLoading ? 'Refreshing...' : 'Refresh'}
    </button>
  );
};
