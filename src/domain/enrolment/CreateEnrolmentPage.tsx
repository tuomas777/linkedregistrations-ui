import React from 'react';

import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import { EVENT_INCLUDES, TEST_EVENT_ID } from '../event/constants';
import { useEventQuery } from '../event/query';
import { Event } from '../event/types';
import CreateEnrolmentPageMeta from './createEnrolmentPageMeta/CreateEnrolmentPageMeta';
import EnrolmentForm from './enrolmentForm/EnrolmentForm';
import styles from './enrolmentPage.module.scss';
import EventInfo from './eventInfo/EventInfo';

type Props = {
  event: Event;
};

const CreateEnrolmentPage: React.FC<Props> = ({ event }) => {
  return (
    <MainContent>
      <CreateEnrolmentPageMeta event={event} />
      <Container withOffset>
        <div className={styles.formContainer}>
          <EventInfo event={event} />
          <div className={styles.divider} />
          <EnrolmentForm />
        </div>
      </Container>
    </MainContent>
  );
};

const CreateEnrolmentPageWrapper: React.FC = () => {
  const { data: event } = useEventQuery({
    id: TEST_EVENT_ID,
    include: EVENT_INCLUDES,
  });

  // TODO: Show 404 error page if event doesn't exist
  if (!event) {
    return null;
  }

  return <CreateEnrolmentPage event={event} />;
};

export default CreateEnrolmentPageWrapper;
