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
import useSignupData from '../signup/hooks/useSignupData';
import { Signup } from '../signup/types';
import SignupGroupForm from '../signupGroup/signupGroupForm/SignupGroupForm';
import { getSignupGroupInitialValues } from '../signupGroup/utils';
import { EnrolmentPageProvider } from './enrolmentPageContext/EnrolmentPageContext';
import EnrolmentPageMeta from './enrolmentPageMeta/EnrolmentPageMeta';
import { EnrolmentServerErrorsProvider } from './enrolmentServerErrorsContext/EnrolmentServerErrorsContext';
import EventInfo from './eventInfo/EventInfo';
import FormContainer from './formContainer/FormContainer';
import useEventAndRegistrationData from './hooks/useEventAndRegistrationData';

type Props = {
  event: Event;
  registration: Registration;
  signup: Signup;
};

const EditSignupPage: React.FC<Props> = ({ event, registration, signup }) => {
  const initialValues = getSignupGroupInitialValues(signup);

  return (
    <MainContent>
      <EnrolmentPageMeta event={event} />
      <Container withOffset>
        <FormContainer>
          <EventInfo event={event} registration={registration} />

          <SignupGroupForm
            initialValues={initialValues}
            readOnly={true}
            registration={registration}
            signup={signup}
          />
        </FormContainer>
      </Container>
    </MainContent>
  );
};

const EditSignupPageWrapper: React.FC = () => {
  const {
    event,
    isLoading: isLoadingEventOrReigstration,
    registration,
  } = useEventAndRegistrationData();
  const { isLoading: isLoadingEnrolment, signup } = useSignupData();
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
      {event && registration && signup ? (
        <EnrolmentPageProvider>
          <EnrolmentServerErrorsProvider>
            <EditSignupPage
              event={event}
              registration={registration}
              signup={signup}
            />
          </EnrolmentServerErrorsProvider>
        </EnrolmentPageProvider>
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default EditSignupPageWrapper;
