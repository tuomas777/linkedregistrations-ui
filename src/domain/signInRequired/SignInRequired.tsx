import { signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import React from 'react';

import Button from '../../common/components/button/Button';
import ErrorTemplate from '../../common/components/errorTemplate/ErrorTemplate';
import MainContent from '../app/layout/mainContent/MainContent';
import styles from './signInRequired.module.scss';

const SignInRequired: React.FC = () => {
  const { t } = useTranslation('common');

  const openGraphProperties = {
    description: t('signInRequired.text'),
    title: t('signInRequired.title'),
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
          buttons={
            <div className={styles.buttons}>
              <Button
                fullWidth={true}
                onClick={() => signIn('tunnistamo')}
                type="button"
                variant="primary"
              >
                {t('signIn')}
              </Button>
            </div>
          }
          text={t('signInRequired.text')}
          title={t('signInRequired.title')}
        />
      </MainContent>
    </>
  );
};

export default SignInRequired;
