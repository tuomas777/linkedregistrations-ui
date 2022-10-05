import { Form, Formik } from 'formik';
import { Notification } from 'hds-react';
import pick from 'lodash/pick';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { FC } from 'react';

import Button from '../../../common/components/button/Button';
import FormikPersist from '../../../common/components/formikPersist/FormikPersist';
import LoadingSpinner from '../../../common/components/loadingSpinner/LoadingSpinner';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import { FORM_NAMES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import Container from '../../app/layout/container/Container';
import MainContent from '../../app/layout/mainContent/MainContent';
import { ROUTES } from '../../app/routes/constants';
import { EVENT_INCLUDES } from '../../event/constants';
import { useEventQuery } from '../../event/query';
import { Event } from '../../event/types';
import NotFound from '../../notFound/NotFound';
import { useRegistrationQuery } from '../../registration/query';
import { Registration } from '../../registration/types';
import ButtonWrapper from '../buttonWrapper/ButtonWrapper';
import { ENROLMENT_QUERY_PARAMS } from '../constants';
import Divider from '../divider/Divider';
import FormContainer from '../formContainer/FormContainer';
import useEnrolmentServerErrors from '../hooks/useEnrolmentServerErrors';
import { useCreateEnrolmentMutation } from '../mutation';
import ReservationTimer from '../reservationTimer/ReservationTimer';
import { Enrolment } from '../types';
import {
  clearCreateEnrolmentFormData,
  clearEnrolmentReservationData,
  getEnrolmentDefaultInitialValues,
  getEnrolmentPayload,
} from '../utils';
import { enrolmentSchema } from '../validation';
import Attendees from './attendees/Attendees';
import InformantInfo from './informantInfo/InformantInfo';
import SummaryEventInfo from './summaryEventInfo/SummaryEventInfo';
import styles from './summaryPage.module.scss';
import SummaryPageMeta from './summaryPageMeta/SummaryPageMeta';

type SummaryPageProps = {
  event: Event;
  registration: Registration;
};

const SummaryPage: FC<SummaryPageProps> = ({ event, registration }) => {
  const { t } = useTranslation(['summary']);
  const locale = useLocale();
  const router = useRouter();

  const initialValues = getEnrolmentDefaultInitialValues(registration);

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrors();

  const goToPage = (pathname: string) => {
    router.push({
      pathname,
      query: pick(router.query, [
        ENROLMENT_QUERY_PARAMS.IFRAME,
        ENROLMENT_QUERY_PARAMS.REDIRECT_URL,
      ]),
    });
  };

  const getToCreateEnrolmentPage = () => {
    goToPage(
      ROUTES.CREATE_ENROLMENT.replace(
        '[registrationId]',
        router.query.registrationId as string
      )
    );
  };

  const goToEnrolmentCompletedPage = (enrolment: Enrolment) => {
    clearCreateEnrolmentFormData(registration.id);
    clearEnrolmentReservationData(registration.id);

    goToPage(
      `/${locale}${ROUTES.ENROLMENT_COMPLETED.replace(
        '[registrationId]',
        registration.id
      ).replace('[accessCode]', enrolment.cancellation_code as string)}`
    );
  };

  const goToCreateEnrolmentPage = () => {
    goToPage(
      `/${locale}${ROUTES.CREATE_ENROLMENT.replace(
        '[registrationId]',
        registration.id
      )}`
    );
  };

  const createEnrolmentMutation = useCreateEnrolmentMutation({
    onError: (error, variables) => {
      showServerErrors({ error: JSON.parse(error.message) });
      reportError({
        data: {
          error: JSON.parse(error.message),
          payload: variables,
          payloadAsString: JSON.stringify(variables),
        },
        message: 'Failed to create enrolment',
      });
    },
    onSuccess: (data) => {
      goToEnrolmentCompletedPage(data);
    },
  });

  return (
    <MainContent className={styles.summaryPage}>
      <SummaryPageMeta event={event} />
      <Container>
        <FormContainer>
          <ServerErrorSummary errors={serverErrorItems} />
          <Notification
            className={styles.notification}
            label={t('notificationTitle')}
          >
            {t('notificationLabel')}
          </Notification>
          <SummaryEventInfo event={event} />

          <Formik
            initialValues={initialValues}
            onSubmit={/* istanbul ignore next */ () => undefined}
            validationSchema={enrolmentSchema}
          >
            {({ values }) => {
              const handleSubmit = async () => {
                try {
                  setServerErrorItems([]);

                  await enrolmentSchema.validate(values, { abortEarly: true });
                  const payload = getEnrolmentPayload(values, registration);

                  createEnrolmentMutation.mutate(payload);
                } catch (e) {
                  goToCreateEnrolmentPage();
                }
              };

              return (
                <Form noValidate>
                  <FormikPersist
                    isSessionStorage={true}
                    name={`${FORM_NAMES.CREATE_ENROLMENT_FORM}-${registration.id}`}
                    savingDisabled={true}
                  />

                  <Divider />
                  <ReservationTimer
                    onReservationNotFound={getToCreateEnrolmentPage}
                    onExpired={getToCreateEnrolmentPage}
                    registration={registration}
                  />
                  <Divider />
                  <Attendees />
                  <InformantInfo values={values} />
                  <ButtonWrapper>
                    <Button onClick={handleSubmit}>{t('buttonSend')}</Button>
                  </ButtonWrapper>
                </Form>
              );
            }}
          </Formik>
        </FormContainer>
      </Container>
    </MainContent>
  );
};

const SummaryPageWrapper: React.FC = () => {
  const router = useRouter();
  const { query } = router;

  const {
    data: registration,
    isFetching: isFetchingRegistration,
    status: statusRegistration,
  } = useRegistrationQuery(
    { id: query.registrationId as string },
    { enabled: !!query.registrationId, retry: 0 }
  );

  const {
    data: event,
    isFetching: isFetchingEvent,
    status: statusEvent,
  } = useEventQuery(
    {
      id: registration?.event as string,
      include: EVENT_INCLUDES,
    },
    { enabled: !!registration?.event }
  );

  return (
    <LoadingSpinner
      isLoading={
        (statusRegistration === 'loading' && isFetchingRegistration) ||
        (statusEvent === 'loading' && isFetchingEvent)
      }
    >
      {event && registration ? (
        <SummaryPage event={event} registration={registration} />
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default SummaryPageWrapper;
