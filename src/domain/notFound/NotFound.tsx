import { useTranslation } from 'next-i18next';
import React from 'react';

import ErrorTemplate from '../../common/components/errorTemplate/ErrorTemplate';
import MainContent from '../app/layout/mainContent/MainContent';

const NotFound: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <MainContent>
      <ErrorTemplate text={t('errorPage.text')} title={t('errorPage.title')} />
    </MainContent>
  );
};

export default NotFound;
