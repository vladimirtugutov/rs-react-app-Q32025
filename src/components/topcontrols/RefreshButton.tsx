import { useTranslations } from 'next-intl';

type RefreshButtonProps = {
  onRefresh: () => void;
  isLoading: boolean;
};

export const RefreshButton = ({ onRefresh, isLoading }: RefreshButtonProps) => {
  const t = useTranslations('Search');

  return (
    <button
      onClick={onRefresh}
      disabled={isLoading}
      className="top-controls-button"
    >
      {isLoading ? t('refreshing') : t('refresh')}
    </button>
  );
};
