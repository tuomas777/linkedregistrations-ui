import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { dehydrate, QueryClient } from 'react-query';

import CreateEnrolmentPage from '../../../../domain/enrolment/CreateEnrolmentPage';
import {
  EVENT_INCLUDES,
  TEST_EVENT_ID,
} from '../../../../domain/event/constants';
import { prefetchEventQuery } from '../../../../domain/event/query';
import { Event } from '../../../../domain/event/types';
import { prefetchPlaceQuery } from '../../../../domain/place/query';
import parseIdFromAtId from '../../../../utils/parseIdFromAtId';

const CreateEnrolment: NextPage = () => <CreateEnrolmentPage />;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const queryClient = new QueryClient();

  await prefetchEventQuery(queryClient, {
    id: TEST_EVENT_ID,
    include: EVENT_INCLUDES,
  });

  const dehydratedState = dehydrate(queryClient);
  const eventQuery = dehydratedState.queries.find(
    (query) => query.queryKey === 'event'
  );

  if (eventQuery && eventQuery.state.data) {
    const event = eventQuery.state.data as Event;
    const placeId = parseIdFromAtId(event.location['@id']);

    if (placeId) {
      await prefetchPlaceQuery(queryClient, placeId);
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(locale as string, [
        'common',
        'enrolment',
      ])),
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default CreateEnrolment;
