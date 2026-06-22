'use client';

import { useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';

export const RefreshButton = () => {
  const t = useTranslations('Search');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button onClick={handleRefresh} disabled={isPending}>
      {isPending ? t('refreshing') : t('refresh')}
    </button>
  );
};

export default RefreshButton;
