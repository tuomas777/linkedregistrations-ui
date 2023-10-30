/* eslint-disable @typescript-eslint/ban-ts-comment */
import 'hds-core/lib/base.min.css';
import '../styles/main.scss';

import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { appWithTranslation, SSRConfig } from 'next-i18next';
import React from 'react';

import { NotificationsProvider } from '../common/components/notificationsContext/NotificationsContext';
import CookieConsent from '../domain/app/cookieConsent/CookieConsent';
import PageLayout from '../domain/app/layout/pageLayout/PageLayout';

type Props = {
  dehydratedState?: unknown;
  session?: Session | null;
} & SSRConfig;

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<Props>) => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <NotificationsProvider>
      <SessionProvider
        session={session}
        refetchInterval={/* 5 minutes */ 5 * 60}
      >
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <CookieConsent />
            <PageLayout {...pageProps}>
              <Component {...pageProps} />
            </PageLayout>
          </Hydrate>
        </QueryClientProvider>
      </SessionProvider>
    </NotificationsProvider>
  );
};

export default appWithTranslation<AppProps<Props>>(MyApp);
