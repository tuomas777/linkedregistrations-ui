import { useEffect } from 'react';

import { Registration } from '../../../registration/types';
import { getEnrolmentReservationData } from '../../utils';
import { useReservationTimer } from './useReservationTimer';

export interface ReservationTimerCallbacks {
  onDataNotFound?: () => void;
  onExpired?: () => void;
}

type Props = {
  registration: Registration;
} & ReservationTimerCallbacks;

const useReservationTimerCallbacks = ({
  onDataNotFound,
  onExpired,
  registration,
}: Props): null => {
  const { callbacksDisabled, timeLeft } = useReservationTimer();

  useEffect(() => {
    const data = getEnrolmentReservationData(registration.id);

    if (!data) {
      onDataNotFound && onDataNotFound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    /* istanbul ignore else */
    if (!callbacksDisabled) {
      if (timeLeft !== null && timeLeft <= 0) {
        onExpired && onExpired();
      }
    }
  }, [callbacksDisabled, onExpired, registration.id, timeLeft]);

  return null;
};

export default useReservationTimerCallbacks;
