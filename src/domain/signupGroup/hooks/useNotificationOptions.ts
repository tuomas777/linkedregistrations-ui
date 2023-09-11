import { useTranslation } from 'next-i18next';
import React from 'react';

import { OptionType } from '../../../types';
import { NOTIFICATIONS } from '../constants';

const useNotificationOptions = (): OptionType[] => {
  const { t } = useTranslation('signup');
  const options: OptionType[] = React.useMemo(
    () =>
      Object.values(NOTIFICATIONS).map((type) => ({
        label: t(`notifications.${type}`),
        value: type,
      })),
    [t]
  );

  return options;
};

export default useNotificationOptions;
