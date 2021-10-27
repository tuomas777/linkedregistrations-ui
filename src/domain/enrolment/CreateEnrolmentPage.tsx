import { useRouter } from 'next/router';
import React from 'react';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import { EVENT_INCLUDES } from '../event/constants';
import { useEventQuery } from '../event/query';
import { Event } from '../event/types';
import NotFound from '../notFound/NotFound';
import { registrationsResponse } from '../registration/__mocks__/registration';
import { Registration } from '../registration/types';
import CreateEnrolmentPageMeta from './createEnrolmentPageMeta/CreateEnrolmentPageMeta';
import EnrolmentForm from './enrolmentForm/EnrolmentForm';
import styles from './enrolmentPage.module.scss';
import EventInfo from './eventInfo/EventInfo';

type Props = {
  event: Event;
  registration: Registration;
};

const CreateEnrolmentPage: React.FC<Props> = ({ event, registration }) => {
  return (
    <MainContent>
      <CreateEnrolmentPageMeta event={event} />
      <Container withOffset>
        <div className={styles.formContainer}>
          <EventInfo event={event} />
          <div className={styles.divider} />
          <EnrolmentForm registration={registration} />
        </div>
      </Container>
    </MainContent>
  );
};

const CreateEnrolmentPageWrapper: React.FC = () => {
  const { query } = useRouter();
  const registration = registrationsResponse.data.find(
    (item) => item.id === query.registrationId
  );

  const { data: event, isLoading } = useEventQuery(
    {
      id: registration?.event_id as string,
      include: EVENT_INCLUDES,
    },
    { enabled: !!registration?.event_id }
  );

  return (
    <LoadingSpinner isLoading={isLoading}>
      {registration && event ? (
        <CreateEnrolmentPage event={event} registration={registration} />
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default CreateEnrolmentPageWrapper;
