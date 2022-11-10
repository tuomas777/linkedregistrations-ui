import { useField } from 'formik';
import isEqual from 'lodash/isEqual';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';

import Button from '../../../common/components/button/Button';
import NumberInput from '../../../common/components/numberInput/NumberInput';
import { reportError } from '../../app/sentry/utils';
import { Registration } from '../../registration/types';
import {
  getAttendeeCapacityError,
  getFreeAttendeeCapacity,
} from '../../registration/utils';
import { useUpdateReserveSeatsMutation } from '../../reserveSeats/mutation';
import {
  getSeatsReservationData,
  setSeatsReservationData,
} from '../../reserveSeats/utils';
import { ENROLMENT_FIELDS } from '../constants';
import { useEnrolmentServerErrorsContext } from '../enrolmentServerErrorsContext/hooks/useEnrolmentServerErrorsContext';
import ConfirmDeleteParticipantModal from '../modals/confirmDeleteParticipantModal/ConfirmDeleteParticipantModal';
import { AttendeeFields } from '../types';
import { getAttendeeDefaultInitialValues } from '../utils';
import styles from './participantAmountSelector.module.scss';

interface Props {
  disabled: boolean;
  registration: Registration;
}

const ParticipantAmountSelector: React.FC<Props> = ({
  disabled,
  registration,
}) => {
  const { t } = useTranslation(['enrolment', 'common']);

  const { setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrorsContext();

  const [openModal, setOpenModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [participantsToDelete, setParticipantsToDelete] = useState(0);

  const [{ value: attendees }, , { setValue: setAttendees }] = useField<
    AttendeeFields[]
  >({ name: ENROLMENT_FIELDS.ATTENDEES });

  const [participantAmount, setParticipantAmount] = useState(
    Math.max(getSeatsReservationData(registration.id)?.seats ?? 0, 1)
  );
  const freeCapacity = getFreeAttendeeCapacity(registration);

  const handleParticipantAmountChange: React.ChangeEventHandler<
    HTMLInputElement
  > = (event) => {
    setParticipantAmount(Number(event.target.value));
  };

  const attendeeCapacityError = getAttendeeCapacityError(
    registration,
    participantAmount,
    t
  );

  const attendeeInitialValues = React.useMemo(
    () => getAttendeeDefaultInitialValues(registration),
    [registration]
  );

  const updateReserveSeatsMutation = useUpdateReserveSeatsMutation({
    onError: (error, variables) => {
      showServerErrors(
        { error: JSON.parse(error.message) },
        'seatsReservation'
      );

      reportError({
        data: {
          error: JSON.parse(error.message),
          payload: variables,
          payloadAsString: JSON.stringify(variables),
        },
        message: 'Failed to update reserve seats',
      });

      setSaving(false);
      closeModal();
    },
    onSuccess: (data) => {
      const seats = data.seats;
      const filledAttendees = attendees.filter(
        (a) => !isEqual(a, attendeeInitialValues)
      );
      const newAttendees = [
        ...filledAttendees,
        ...Array(Math.max(seats - filledAttendees.length, 0)).fill(
          attendeeInitialValues
        ),
      ].slice(0, seats);

      setAttendees(newAttendees);
      // TODO: Update reservation from API when BE is ready
      setSeatsReservationData(registration.id, data);

      setSaving(false);
      closeModal();
    },
  });

  const updateParticipantAmount = () => {
    /* istanbul ignore else */
    if (participantAmount !== attendees.length) {
      setSaving(true);

      const data = getSeatsReservationData(registration.id);

      // Clear server errors
      setServerErrorItems([]);

      updateReserveSeatsMutation.mutate({
        code: data?.code as string,
        registration: registration.id,
        seats: participantAmount,
        waitlist: false,
      });
    }
  };

  const closeModal = () => {
    setOpenModal(false);
  };

  const openParticipantModal = () => {
    setOpenModal(true);
  };

  const handleUpdateClick = () => {
    if (participantAmount < attendees.length) {
      setParticipantsToDelete(attendees.length - participantAmount);
      openParticipantModal();
    } else {
      updateParticipantAmount();
    }
  };

  return (
    <>
      <ConfirmDeleteParticipantModal
        isOpen={openModal}
        isSaving={saving}
        onClose={closeModal}
        onDelete={updateParticipantAmount}
        participantCount={participantsToDelete}
      />
      <div className={styles.participantAmountSelector}>
        <NumberInput
          id="participant-amount-field"
          minusStepButtonAriaLabel={t(
            'common:numberInput.minusStepButtonAriaLabel'
          )}
          plusStepButtonAriaLabel={t(
            'common:numberInput.plusStepButtonAriaLabel'
          )}
          disabled={disabled}
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
            disabled={disabled || !!attendeeCapacityError}
            onClick={handleUpdateClick}
            type="button"
            variant="secondary"
          >
            {t(`buttonUpdateParticipantAmount`)}
          </Button>
        </div>
      </div>
    </>
  );
};

export default ParticipantAmountSelector;
