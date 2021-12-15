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
import { enrolment } from './__mocks__/enrolment';
import EditEnrolmentPageMeta from './editEnrolmentPageMeta/EditEnrolmentPageMeta';
import EnrolmentForm from './enrolmentForm/EnrolmentForm';
import styles from './enrolmentPage.module.scss';
import EventInfo from './eventInfo/EventInfo';
import { Enrolment } from './types';
import { getEnrolmentInitialValues } from './utils';

type Props = {
  cancellationCode: string;
  enrolment: Enrolment;
  event: Event;
  registration: Registration;
};

const EditEnrolmentPage: React.FC<Props> = ({
  cancellationCode,
  enrolment,
  event,
  registration,
}) => {
  const initialValues = getEnrolmentInitialValues(enrolment, registration);
  return (
    <MainContent>
      <EditEnrolmentPageMeta event={event} />
      <Container withOffset>
        <div className={styles.formContainer}>
          <EventInfo event={event} />
          <div className={styles.divider} />
          <EnrolmentForm
            cancellationCode={cancellationCode}
            initialValues={initialValues}
            readOnly={true}
            registration={registration}
          />
        </div>
      </Container>
    </MainContent>
  );
};

const EditEnrolmentPageWrapper: React.FC = () => {
  const { query } = useRouter();

  const { data: registration, isLoading: isLoadingRegistration } =
    useRegistrationQuery(
      { id: query.registrationId as string },
      { enabled: !!query.registrationId }
    );

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
        <EditEnrolmentPage
          cancellationCode={query.accessCode as string}
          enrolment={enrolment}
          event={event}
          registration={registration}
        />
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default EditEnrolmentPageWrapper;
