import { GetServerSideProps, NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { dehydrate, QueryClient } from 'react-query';

import CreateEnrolmentPage from '../../../../domain/enrolment/CreateEnrolmentPage';
import { EVENT_INCLUDES } from '../../../../domain/event/constants';
import { fetchEventQuery } from '../../../../domain/event/query';
import { prefetchPlaceQuery } from '../../../../domain/place/query';
import { registrationsResponse } from '../../../../domain/registration/__mocks__/registration';
import parseIdFromAtId from '../../../../utils/parseIdFromAtId';

const CreateEnrolment: NextPage = () => <CreateEnrolmentPage />;

export const getServerSideProps: GetServerSideProps = async ({
  locale,
  query,
}) => {
  const queryClient = new QueryClient();

  const registration = registrationsResponse.data.find(
    (item) => item.id === query.registrationId
  );

  try {
    if (registration?.event_id) {
      const event = await fetchEventQuery(queryClient, {
        id: registration?.event_id,
        include: EVENT_INCLUDES,
      });

      if (event) {
        const placeId = parseIdFromAtId(event.location['@id']);

        if (placeId) {
          await prefetchPlaceQuery(queryClient, placeId);
        }
      }
    }
  } catch {}

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
