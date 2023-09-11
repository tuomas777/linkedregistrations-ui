import { useSession } from 'next-auth/react';
import React from 'react';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import { ExtendedSession } from '../../types';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
// eslint-disable-next-line max-len
import AuthenticationRequiredNotification from '../enrolment/authenticationRequiredNotification/AuthenticationRequiredNotification';
import { EnrolmentPageProvider } from '../enrolment/enrolmentPageContext/EnrolmentPageContext';
import EnrolmentPageMeta from '../enrolment/enrolmentPageMeta/EnrolmentPageMeta';
import { EnrolmentServerErrorsProvider } from '../enrolment/enrolmentServerErrorsContext/EnrolmentServerErrorsContext';
import EventInfo from '../enrolment/eventInfo/EventInfo';
import FormContainer from '../enrolment/formContainer/FormContainer';
import useEventAndRegistrationData from '../enrolment/hooks/useEventAndRegistrationData';
import { Event } from '../event/types';
import NotFound from '../notFound/NotFound';
import { Registration } from '../registration/types';
import SignupGroupForm from './signupGroupForm/SignupGroupForm';
import { getSignupGroupDefaultInitialValues } from './utils';

type Props = {
  event: Event;
  registration: Registration;
};

const CreateSignupGroupPage: React.FC<Props> = ({ event, registration }) => {
  const initialValues = getSignupGroupDefaultInitialValues();
  const { data: session } = useSession() as {
    data: ExtendedSession | null;
  };

  return (
    <MainContent>
      <EnrolmentPageMeta event={event} />
      <Container withOffset>
        <FormContainer>
          {!session && <AuthenticationRequiredNotification />}
          <EventInfo event={event} registration={registration} />
          {session && (
            <SignupGroupForm
              initialValues={initialValues}
              registration={registration}
            />
          )}
        </FormContainer>
      </Container>
    </MainContent>
  );
};

const CreateSignupGroupPageWrapper: React.FC = () => {
  const { event, isLoading, registration } = useEventAndRegistrationData();

  return (
    <LoadingSpinner isLoading={isLoading}>
      {registration && event ? (
        <EnrolmentPageProvider>
          <EnrolmentServerErrorsProvider>
            <CreateSignupGroupPage event={event} registration={registration} />
          </EnrolmentServerErrorsProvider>
        </EnrolmentPageProvider>
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default CreateSignupGroupPageWrapper;
