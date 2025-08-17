import { useContext } from 'react';
import SearchContext from './SearchContext';
import { useTranslations } from 'next-intl';

export const SearchButton = () => {
  const t = useTranslations('Search');
  const context = useContext(SearchContext);

  return (
    <button
      onClick={context.handleSearchButtonClick}
      className="top-controls-button"
    >
      {t('button')}
    </button>
  );
};

export default SearchButton;
