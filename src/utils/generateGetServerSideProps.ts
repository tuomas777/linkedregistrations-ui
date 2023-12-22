/* eslint-disable no-console */
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { getServerSession, NextAuthOptions } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { RegistrationQueryVariables } from '../domain/registration/types';
import { prefetchSignupQuery } from '../domain/signup/query';
import { prefetchSignupGroupQuery } from '../domain/signupGroup/query';
import { getNextAuthOptions } from '../pages/api/auth/[...nextauth]';
import {
  ExtendedSession,
  ExtendedSSRConfig,
  TranslationNamespaces,
} from '../types';

import prefetchRegistrationAndEvent from './prefetchRegistrationAndEvent';

type Props = {
  overrideRegistrationsVariables?: Partial<RegistrationQueryVariables>;
  shouldPrefetchPlace: boolean;
  shouldPrefetchSignup: boolean;
  shouldPrefetchSignupGroup: boolean;
  translationNamespaces: TranslationNamespaces;
};

const generateGetServerSideProps = ({
  overrideRegistrationsVariables,
  shouldPrefetchPlace,
  shouldPrefetchSignup,
  shouldPrefetchSignupGroup,
  translationNamespaces,
}: Props): GetServerSideProps<ExtendedSSRConfig> => {
  return async ({ locale, query, req, res }) => {
    const queryClient = new QueryClient();
    const session = await getServerSession<NextAuthOptions, ExtendedSession>(
      req,
      res,
      getNextAuthOptions()
    );

    await prefetchRegistrationAndEvent({
      overrideRegistrationsVariables,
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

    try {
      if (
        shouldPrefetchSignupGroup &&
        typeof query?.signupGroupId === 'string'
      ) {
        await prefetchSignupGroupQuery({
          args: { id: query.signupGroupId },
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

export default generateGetServerSideProps;
