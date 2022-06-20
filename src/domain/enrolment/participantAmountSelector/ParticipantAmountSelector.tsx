import { useField } from 'formik';
import isEqual from 'lodash/isEqual';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';

import Button from '../../../common/components/button/Button';
import NumberInput from '../../../common/components/numberInput/NumberInput';
import { Registration } from '../../registration/types';
import {
  getAttendeeCapacityError,
  getFreeAttendeeCapacity,
} from '../../registration/utils';
import { ENROLMENT_FIELDS } from '../constants';
import { AttendeeFields } from '../types';
import {
  getAttendeeDefaultInitialValues,
  getEnrolmentReservationData,
  updateEnrolmentReservationData,
} from '../utils';
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

  const [{ value: attendees }, , { setValue: setAttendees }] = useField<
    AttendeeFields[]
  >({
    name: ENROLMENT_FIELDS.ATTENDEES,
  });

  const [participantAmount, setParticipantAmount] = useState(
    Math.max(getEnrolmentReservationData(registration.id)?.participants ?? 0, 1)
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

  const handleUpdateParticipantAmount = () => {
    /* istanbul ignore next */
    if (participantAmount !== attendees.length) {
      const filledAttendees = attendees.filter(
        (a) => !isEqual(a, attendeeInitialValues)
      );
      const newAttendees = [
        ...filledAttendees,
        ...Array(Math.max(participantAmount - filledAttendees.length, 0)).fill(
          attendeeInitialValues
        ),
      ].slice(0, participantAmount);

      setAttendees(newAttendees);
      // TODO: Update reservation from API when BE is ready
      updateEnrolmentReservationData(registration, newAttendees.length);
    }
  };

  return (
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
          onClick={handleUpdateParticipantAmount}
          type="button"
          variant="secondary"
        >
          {t(`buttonUpdateParticipantAmount`)}
        </Button>
      </div>
    </div>
  );
};

export default ParticipantAmountSelector;
