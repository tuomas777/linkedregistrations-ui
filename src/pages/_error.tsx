import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NextErrorComponent from 'next/error';
import React from 'react';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'fi', ['common'])),
    },
  };
};

const NotFoundPage = (): React.ReactElement => {
  return <NextErrorComponent statusCode={404} />;
};

export default NotFoundPage;
