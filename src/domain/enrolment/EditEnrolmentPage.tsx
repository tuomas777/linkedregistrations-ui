import { useSession } from 'next-auth/react';
import React from 'react';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ExtendedSession } from '../../types';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import { Event } from '../event/types';
import NotFound from '../notFound/NotFound';
import { Registration } from '../registration/types';
import SignInRequired from '../signInRequired/SignInRequired';
import EnrolmentForm from './enrolmentForm/EnrolmentForm';
import { EnrolmentPageProvider } from './enrolmentPageContext/EnrolmentPageContext';
import EnrolmentPageMeta from './enrolmentPageMeta/EnrolmentPageMeta';
import { EnrolmentServerErrorsProvider } from './enrolmentServerErrorsContext/EnrolmentServerErrorsContext';
import EventInfo from './eventInfo/EventInfo';
import FormContainer from './formContainer/FormContainer';
import useEnrolmentData from './hooks/useEnrolmentData';
import useEventAndRegistrationData from './hooks/useEventAndRegistrationData';
import { Enrolment } from './types';
import { getEnrolmentInitialValues } from './utils';

type Props = {
  enrolment: Enrolment;
  event: Event;
  registration: Registration;
};

const EditEnrolmentPage: React.FC<Props> = ({
  enrolment,
  event,
  registration,
}) => {
  const initialValues = getEnrolmentInitialValues(enrolment);

  return (
    <MainContent>
      <EnrolmentPageMeta event={event} />
      <Container withOffset>
        <FormContainer>
          <EventInfo event={event} registration={registration} />

          <EnrolmentForm
            enrolment={enrolment}
            initialValues={initialValues}
            readOnly={true}
            registration={registration}
          />
        </FormContainer>
      </Container>
    </MainContent>
  );
};

const EditEnrolmentPageWrapper: React.FC = () => {
  const {
    event,
    isLoading: isLoadingEventOrReigstration,
    registration,
  } = useEventAndRegistrationData();
  const { enrolment, isLoading: isLoadingEnrolment } = useEnrolmentData();
  const { data: session } = useSession() as {
    data: ExtendedSession | null;
  };

  if (!session) {
    return <SignInRequired />;
  }

  return (
    <LoadingSpinner
      isLoading={isLoadingEnrolment || isLoadingEventOrReigstration}
    >
      {enrolment && event && registration ? (
        <EnrolmentPageProvider>
          <EnrolmentServerErrorsProvider>
            <EditEnrolmentPage
              enrolment={enrolment}
              event={event}
              registration={registration}
            />
          </EnrolmentServerErrorsProvider>
        </EnrolmentPageProvider>
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default EditEnrolmentPageWrapper;
