/* eslint-disable no-undef */
import addMinutes from 'date-fns/addMinutes';
import isPast from 'date-fns/isPast';
import { useTranslation } from 'next-i18next';
import React from 'react';

import getUnixTime from '../../../utils/getUnixTime';
import { Registration } from '../../registration/types';
import { ENROLMENT_TIME_IN_MINUTES } from '../constants';
import {
  getEnrolmentReservationData,
  getRegistrationTimeLeft,
  setEnrolmentReservationData,
} from '../utils';
import { useReservationTimer } from './hooks/useReservationTimer';
import useReservationTimerCallbacks, {
  ReservationTimerCallbacks,
} from './hooks/useReservationTimerCallbacks';

type Props = {
  initializeReservationData: boolean;
  registration: Registration;
} & ReservationTimerCallbacks;

const getTimeStr = (timeLeft: number) => {
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor(timeLeft / 60) % 60;
  const seconds = timeLeft % 60;

  return [
    hours,
    ...[minutes, seconds].map((n) => n.toString().padStart(2, '0')),
  ]
    .filter((i) => i)
    .join(':');
};

const ReservationTimer: React.FC<Props> = ({
  initializeReservationData,
  onDataNotFound,
  onExpired,
  registration,
}) => {
  const { t } = useTranslation('enrolment');
  const { timeLeft, setTimeLeft } = useReservationTimer();

  // Handle reservation missing or expired expections
  useReservationTimerCallbacks({ onDataNotFound, onExpired, registration });

  React.useEffect(() => {
    const data = getEnrolmentReservationData(registration.id);

    if (initializeReservationData && (!data || isPast(data.expires * 1000))) {
      // TODO: Get this data from the API when BE part is implemented
      const now = new Date();

      setEnrolmentReservationData(registration.id, {
        expires: getUnixTime(addMinutes(now, ENROLMENT_TIME_IN_MINUTES)),
        participants: 1,
        session: '',
        started: getUnixTime(now),
      });
    }

    setTimeLeft(getRegistrationTimeLeft(registration));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getRegistrationTimeLeft(registration));
    }, 1000);

    return () => clearInterval(interval);
  }, [registration, setTimeLeft, timeLeft]);

  return (
    <div>
      {t('timeLeft')}{' '}
      <strong>{timeLeft !== null && getTimeStr(timeLeft)}</strong>
    </div>
  );
};

export default ReservationTimer;
