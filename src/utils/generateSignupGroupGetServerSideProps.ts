/* eslint-disable no-console */
import { dehydrate, QueryClient } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { prefetchSignupGroupQuery } from '../domain/signupGroup/query';
import { ExtendedSSRConfig, TranslationNamespaces } from '../types';
import { getSessionAndUser } from './getSessionAndUser';
import prefetchRegistrationAndEvent from './prefetchRegistrationAndEvent';

type Props = {
  shouldPrefetchPlace: boolean;
  shouldPrefetchSignupGroup: boolean;
  translationNamespaces: TranslationNamespaces;
};

const generateSignupGroupGetServerSideProps = ({
  shouldPrefetchPlace,
  shouldPrefetchSignupGroup,
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

export default generateSignupGroupGetServerSideProps;
