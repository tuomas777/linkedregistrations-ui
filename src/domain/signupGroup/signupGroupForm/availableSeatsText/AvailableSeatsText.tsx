import { useTranslation } from 'next-i18next';
import { FC, useMemo } from 'react';

import { Registration } from '../../../registration/types';
import {
  getFreeAttendeeCapacity,
  getFreeWaitingListCapacity,
  isAttendeeCapacityUsed,
} from '../../../registration/utils';
import {
  getSeatsReservationData,
  isSeatsReservationExpired,
} from '../../../reserveSeats/utils';

type Props = {
  registration: Registration;
};
const AvailableSeatsText: FC<Props> = ({ registration }) => {
  const { t } = useTranslation(['signup']);

  const freeAttendeeCapacity = getFreeAttendeeCapacity(registration);
  const attendeeCapacityUsed = isAttendeeCapacityUsed(registration);
  const freeWaitingListCapacity = getFreeWaitingListCapacity(registration);

  const reservedSeats = useMemo(() => {
    const data = getSeatsReservationData(registration.id as string);
    return data && !isSeatsReservationExpired(data) ? data.seats : 0;
  }, [registration.id]);
  return (
    <>
      {typeof freeAttendeeCapacity === 'number' && !attendeeCapacityUsed && (
        <p>
          {t('freeAttendeeCapacity')}{' '}
          <strong>{freeAttendeeCapacity + reservedSeats}</strong>
        </p>
      )}
      {attendeeCapacityUsed && typeof freeWaitingListCapacity === 'number' && (
        <p>
          {t('freeWaitingListCapacity')}{' '}
          <strong>{freeWaitingListCapacity + reservedSeats}</strong>
        </p>
      )}
    </>
  );
};

export default AvailableSeatsText;
