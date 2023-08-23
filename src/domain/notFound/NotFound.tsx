import { useTranslation } from 'next-i18next';
import React from 'react';

import ErrorTemplate from '../../common/components/errorTemplate/ErrorTemplate';
import ErrorPageMeta from '../../common/components/errrorPageMeta/ErrorPageMeta';
import MainContent from '../app/layout/mainContent/MainContent';

const NotFound: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <>
      <ErrorPageMeta
        description={t('errorPage.text')}
        title={t('errorPage.title')}
      />

      <MainContent>
        <ErrorTemplate
          text={t('errorPage.text')}
          title={t('errorPage.title')}
        />
      </MainContent>
    </>
  );
};

export default NotFound;
