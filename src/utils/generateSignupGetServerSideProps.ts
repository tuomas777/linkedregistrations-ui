/* eslint-disable no-console */
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { prefetchSignupQuery } from '../domain/signup/query';
import { ExtendedSSRConfig, TranslationNamespaces } from '../types';

import { getSessionAndUser } from './getSessionAndUser';
import prefetchRegistrationAndEvent from './prefetchRegistrationAndEvent';

type Props = {
  translationNamespaces: TranslationNamespaces;
  shouldPrefetchPlace: boolean;
  shouldPrefetchSignup: boolean;
};

const generateSignupGetServerSideProps = ({
  shouldPrefetchPlace,
  shouldPrefetchSignup,
  translationNamespaces,
}: Props): GetServerSideProps<ExtendedSSRConfig> => {
  return async ({ locale, query, req, res }) => {
    const queryClient = new QueryClient();
    const { session } = await getSessionAndUser(queryClient, {
      req,
      res,
    });

    await prefetchRegistrationAndEvent({
      query,
      queryClient,
      session,
      shouldPrefetchPlace,
    });

    try {
      if (shouldPrefetchSignup && typeof query?.signupId === 'string') {
        await prefetchSignupQuery({
          args: { id: query.signupId },
          queryClient,
          session,
        });
      }
    } catch (e) /* istanbul ignore next */ {
      console.error(e);
    }

    return {
      props: {
        ...(await serverSideTranslations(
          locale as string,
          translationNamespaces
        )),
        dehydratedState: dehydrate(queryClient),
        session,
      },
    };
  };
};

export default generateSignupGetServerSideProps;
