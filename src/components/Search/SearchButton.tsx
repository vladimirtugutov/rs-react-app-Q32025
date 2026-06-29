import { useTranslations } from 'next-intl';

export const SearchButton = () => {
  const t = useTranslations('Search');

  return (
    <button type="submit" className="top-controls-button">
      {t('button')}
    </button>
  );
};

export default SearchButton;
