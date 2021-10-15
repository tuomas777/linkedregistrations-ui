import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { dehydrate, QueryClient } from 'react-query';

import CreateEnrolmentPage from '../../../../domain/enrolment/CreateEnrolmentPage';
import {
  EVENT_INCLUDES,
  TEST_EVENT_ID,
} from '../../../../domain/event/constants';
import { fetchEventQuery } from '../../../../domain/event/query';
import { prefetchPlaceQuery } from '../../../../domain/place/query';
import parseIdFromAtId from '../../../../utils/parseIdFromAtId';

const CreateEnrolment: NextPage = () => <CreateEnrolmentPage />;

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  const queryClient = new QueryClient();

  const event = await fetchEventQuery(queryClient, {
    id: TEST_EVENT_ID,
    include: EVENT_INCLUDES,
  });

  if (event) {
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
