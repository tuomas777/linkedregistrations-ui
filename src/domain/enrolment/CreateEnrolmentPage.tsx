import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import Button from '../../common/components/button/Button';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import NumberInput from '../../common/components/numberInput/NumberInput';
import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import { EVENT_INCLUDES } from '../event/constants';
import { useEventQuery } from '../event/query';
import { Event } from '../event/types';
import NotFound from '../notFound/NotFound';
import { useRegistrationQuery } from '../registration/query';
import { Registration } from '../registration/types';
import {
  getAttendeeCapacityError,
  getFreeAttendeeCapacity,
} from '../registration/utils';
import CreateEnrolmentPageMeta from './createEnrolmentPageMeta/CreateEnrolmentPageMeta';
import EnrolmentForm from './enrolmentForm/EnrolmentForm';
import styles from './enrolmentPage.module.scss';
import EnrolmentPageContext, {
  useEnrolmentPageContextValue,
} from './enrolmentPageContext/EnrolmentPageContext';
import EventInfo from './eventInfo/EventInfo';
import { getEnrolmentDefaultInitialValues } from './utils';

type Props = {
  event: Event;
  registration: Registration;
};

const CreateEnrolmentPage: React.FC<Props> = ({ event, registration }) => {
  const { t } = useTranslation(['enrolment', 'common']);
  const [participantAmount, setParticipantAmount] = useState(1);
  const [confirmedParticipantAmount, setConfirmedParticipantAmount] =
    useState(1);
  const freeCapacity = getFreeAttendeeCapacity(registration);
  const initialValues = getEnrolmentDefaultInitialValues(registration);

  const attendeeCapacityError = getAttendeeCapacityError(
    registration,
    participantAmount,
    t
  );

  const handleParticipantAmountChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    setParticipantAmount(Number(event.target.value));
  };

  const handleUpdateParticipantAmount = () => {
    setConfirmedParticipantAmount(participantAmount);
  };

  return (
    <MainContent>
      <CreateEnrolmentPageMeta event={event} />
      <Container withOffset>
        <div className={styles.formContainer}>
          <EventInfo event={event} registration={registration} />
          <div className={styles.divider} />
          <div className={styles.participantAmountRow}>
            <NumberInput
              id="participant-amount-field"
              minusStepButtonAriaLabel={t(
                'common:numberInput.minusStepButtonAriaLabel'
              )}
              plusStepButtonAriaLabel={t(
                'common:numberInput.plusStepButtonAriaLabel'
              )}
              errorText={attendeeCapacityError}
              invalid={!!attendeeCapacityError}
              label={t(`labelParticipantAmount`)}
              min={1}
              max={freeCapacity}
              onChange={handleParticipantAmountChange}
              required
              step={1}
              value={participantAmount}
            />
            <div className={styles.buttonWrapper}>
              <Button
                disabled={!!attendeeCapacityError}
                onClick={handleUpdateParticipantAmount}
                variant="secondary"
              >
                {t(`buttonUpdateParticipantAmount`)}
              </Button>
            </div>
          </div>
          <EnrolmentForm
            initialValues={initialValues}
            participantAmount={confirmedParticipantAmount}
            registration={registration}
          />
        </div>
      </Container>
    </MainContent>
  );
};

const CreateEnrolmentPageWrapper: React.FC = () => {
  const router = useRouter();
  const { query } = router;

  const { data: registration, isLoading: isLoadingRegistration } =
    useRegistrationQuery(
      {
        id: query.registrationId as string,
      },
      { enabled: !!query.registrationId }
    );

  const { data: event, isLoading: isLoadingEvent } = useEventQuery(
    {
      id: registration?.event as string,
      include: EVENT_INCLUDES,
    },
    { enabled: !!registration?.event }
  );

  const { openParticipant, setOpenParticipant, toggleOpenParticipant } =
    useEnrolmentPageContextValue();

  return (
    <LoadingSpinner isLoading={isLoadingRegistration || isLoadingEvent}>
      {registration && event ? (
        <EnrolmentPageContext.Provider
          value={{ openParticipant, setOpenParticipant, toggleOpenParticipant }}
        >
          <CreateEnrolmentPage event={event} registration={registration} />
        </EnrolmentPageContext.Provider>
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default CreateEnrolmentPageWrapper;
