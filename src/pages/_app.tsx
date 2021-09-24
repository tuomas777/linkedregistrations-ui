import 'hds-core/lib/base.min.css';
import '../styles/main.scss';

import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import React from 'react';

import PageLayout from '../domain/app/layout/pageLayout/PageLayout';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <PageLayout {...pageProps}>
    <Component {...pageProps} />
  </PageLayout>
);

export default appWithTranslation(MyApp);
