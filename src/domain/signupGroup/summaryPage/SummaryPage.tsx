/* eslint-disable max-len */
import { Form, Formik } from 'formik';
import { Notification } from 'hds-react';
import pick from 'lodash/pick';
import { useSession } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { FC, useCallback, useRef } from 'react';

import Button from '../../../common/components/button/Button';
import FormikPersist from '../../../common/components/formikPersist/FormikPersist';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import { FORM_NAMES } from '../../../constants';
import { ExtendedSession } from '../../../types';
import Container from '../../app/layout/container/Container';
import MainContent from '../../app/layout/mainContent/MainContent';
import { ROUTES } from '../../app/routes/constants';
import AuthenticationRequiredNotification from '../../enrolment/authenticationRequiredNotification/AuthenticationRequiredNotification';
import ButtonWrapper from '../../enrolment/buttonWrapper/ButtonWrapper';
import { ENROLMENT_QUERY_PARAMS } from '../../enrolment/constants';
import Divider from '../../enrolment/divider/Divider';
import { EnrolmentPageProvider } from '../../enrolment/enrolmentPageContext/EnrolmentPageContext';
import { EnrolmentServerErrorsProvider } from '../../enrolment/enrolmentServerErrorsContext/EnrolmentServerErrorsContext';
import { useEnrolmentServerErrorsContext } from '../../enrolment/enrolmentServerErrorsContext/hooks/useEnrolmentServerErrorsContext';
import EventInfo from '../../enrolment/eventInfo/EventInfo';
import FormContainer from '../../enrolment/formContainer/FormContainer';
import useEventAndRegistrationData from '../../enrolment/hooks/useEventAndRegistrationData';
import ReservationTimer from '../../enrolment/reservationTimer/ReservationTimer';
import { Event } from '../../event/types';
import NotFound from '../../notFound/NotFound';
import { Registration } from '../../registration/types';
import {
  clearSeatsReservationData,
  getSeatsReservationData,
} from '../../reserveSeats/utils';
import useSignupAction from '../../signup/hooks/useSignupActions';
import {
  clearCreateSignupGroupFormData,
  getSignupGroupDefaultInitialValues,
  getSignupGroupPayload,
} from '../utils';
import { getSignupGroupSchema } from '../validation';
import InformantInfo from './informantInfo/InformantInfo';
import Signups from './signups/Signups';
import SummaryEventInfo from './summaryEventInfo/SummaryEventInfo';
import styles from './summaryPage.module.scss';
import SummaryPageMeta from './summaryPageMeta/SummaryPageMeta';

type SummaryPageProps = {
  event: Event;
  registration: Registration;
};

const SummaryPage: FC<SummaryPageProps> = ({ event, registration }) => {
  const { data: session } = useSession() as {
    data: ExtendedSession | null;
  };

  const { createSignupGroup } = useSignupAction({ registration });

  const reservationTimerCallbacksDisabled = useRef(false);
  const disableReservationTimerCallbacks = useCallback(() => {
    reservationTimerCallbacksDisabled.current = true;
  }, []);

  const { t } = useTranslation(['summary']);
  const router = useRouter();

  const goToSignupGroupCompletedPage = () => {
    // Disable reservation timer callbacks
    // so user is not redirected to create enrolment page
    disableReservationTimerCallbacks();

    clearCreateSignupGroupFormData(registration.id);
    clearSeatsReservationData(registration.id);

    goToPage(
      ROUTES.SIGNUP_GROUP_COMPLETED.replace('[registrationId]', registration.id)
    );
  };

  const goToCreateSignupGroupPage = () => {
    goToPage(
      ROUTES.CREATE_SIGNUP_GROUP.replace(
        '[registrationId]',
        router.query.registrationId as string
      )
    );
  };

  const initialValues = getSignupGroupDefaultInitialValues();

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrorsContext();

  const goToPage = (pathname: string) => {
    router.push({
      pathname,
      query: pick(router.query, [
        ENROLMENT_QUERY_PARAMS.IFRAME,
        ENROLMENT_QUERY_PARAMS.REDIRECT_URL,
      ]),
    });
  };

  return (
    <MainContent className={styles.summaryPage}>
      <SummaryPageMeta event={event} />
      <Container>
        <FormContainer>
          <ServerErrorSummary errors={serverErrorItems} />

          {!session && (
            <>
              <AuthenticationRequiredNotification />
              <EventInfo event={event} registration={registration} />
            </>
          )}
          {session && (
            <>
              <Notification
                className={styles.notification}
                label={t('notificationTitle')}
              >
                {t('notificationLabel')}
              </Notification>
              <SummaryEventInfo registration={registration} />
              <Formik
                initialValues={initialValues}
                onSubmit={/* istanbul ignore next */ () => undefined}
                validationSchema={() => getSignupGroupSchema(registration)}
              >
                {({ values }) => {
                  const handleSubmit = async () => {
                    try {
                      setServerErrorItems([]);

                      await getSignupGroupSchema(registration).validate(
                        values,
                        { abortEarly: true }
                      );

                      const reservationData = getSeatsReservationData(
                        registration.id
                      );
                      const payload = getSignupGroupPayload({
                        formValues: values,
                        registration,
                        reservationCode: reservationData?.code as string,
                      });

                      createSignupGroup(payload, {
                        onError: (error) =>
                          showServerErrors(
                            { error: JSON.parse(error.message) },
                            'enrolment'
                          ),
                        onSuccess: goToSignupGroupCompletedPage,
                      });
                    } catch (e) {
                      goToCreateSignupGroupPage();
                    }
                  };

                  return (
                    <Form noValidate>
                      <FormikPersist
                        isSessionStorage={true}
                        name={`${FORM_NAMES.CREATE_SIGNUP_GROUP_FORM}-${registration.id}`}
                        savingDisabled={true}
                      />

                      <Divider />

                      <ReservationTimer
                        callbacksDisabled={
                          reservationTimerCallbacksDisabled.current
                        }
                        disableCallbacks={disableReservationTimerCallbacks}
                        initReservationData={false}
                        onDataNotFound={goToCreateSignupGroupPage}
                        registration={registration}
                      />
                      <Divider />
                      <Signups />
                      <InformantInfo values={values} />
                      <ButtonWrapper>
                        <Button onClick={handleSubmit}>
                          {t('buttonSend')}
                        </Button>
                      </ButtonWrapper>
                    </Form>
                  );
                }}
              </Formik>
            </>
          )}
        </FormContainer>
      </Container>
    </MainContent>
  );
};

const SummaryPageWrapper: React.FC = () => {
  const { event, isLoading, registration } = useEventAndRegistrationData();

  return (
    <LoadingSpinner isLoading={isLoading}>
      {event && registration ? (
        <EnrolmentPageProvider>
          <EnrolmentServerErrorsProvider>
            <SummaryPage event={event} registration={registration} />
          </EnrolmentServerErrorsProvider>
        </EnrolmentPageProvider>
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default SummaryPageWrapper;
