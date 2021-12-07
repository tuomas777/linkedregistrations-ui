import { useRouter } from 'next/router';
import React from 'react';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import { EVENT_INCLUDES } from '../event/constants';
import { useEventQuery } from '../event/query';
import { Event } from '../event/types';
import NotFound from '../notFound/NotFound';
import { useRegistrationQuery } from '../registration/query';
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
  const router = useRouter();
  const { query } = router;

  const { data: registration, isLoading: isLoadingRegistration } =
    useRegistrationQuery({
      id: query.registrationId as string,
    });

  const { data: event, isLoading: isLoadingEvent } = useEventQuery(
    {
      id: registration?.event as string,
      include: EVENT_INCLUDES,
    },
    { enabled: !!registration?.event }
  );

  return (
    <LoadingSpinner isLoading={isLoadingRegistration || isLoadingEvent}>
      {registration && event ? (
        <CreateEnrolmentPage event={event} registration={registration} />
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default CreateEnrolmentPageWrapper;
