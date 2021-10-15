import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React from 'react';

import ErrorTemplate from '../../common/components/errorTemplate/ErrorTemplate';
import MainContent from '../app/layout/mainContent/MainContent';

const NotFound: React.FC = () => {
  const { t } = useTranslation('common');

  const openGraphProperties = {
    description: t('errorPage.text'),
    title: t('errorPage.title'),
  };
  return (
    <>
      <Head>
        <title>{openGraphProperties.title}</title>
        <meta name="description" content={openGraphProperties.description} />
        <meta name="twitter:card" content="summary" />
        {Object.entries(openGraphProperties)
          .filter((p) => p)
          .map(([property, value]) => (
            <meta key={property} property={`og:${property}`} content={value} />
          ))}
      </Head>
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
