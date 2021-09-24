import '../styles/main.scss';
import { appWithTranslation } from 'next-i18next';
import type { AppProps } from 'next/app';
import React from 'react';

const MyApp = ({ Component, pageProps }: AppProps) => (
  <Component {...pageProps} />
);

export default appWithTranslation(MyApp);
