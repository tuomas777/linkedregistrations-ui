import addMinutes from 'date-fns/addMinutes';
import isPast from 'date-fns/isPast';
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from 'react';

import getUnixTime from '../../../utils/getUnixTime';
import { Registration } from '../../registration/types';
import { ENROLMENT_TIME_IN_MINUTES } from '../constants';
import {
  getEnrolmentReservationData,
  getRegistrationTimeLeft,
  setEnrolmentReservationData,
} from '../utils';

export type ReservationTimerContextProps = {
  callbacksDisabled: boolean;
  disableCallbacks: () => void;
  registration: Registration;
  timeLeft: number | null;
};

export const ReservationTimerContext = React.createContext<
  ReservationTimerContextProps | undefined
>(undefined);

interface Props {
  initializeReservationData: boolean;
  registration: Registration;
}

export const ReservationTimerProvider: FC<PropsWithChildren<Props>> = ({
  children,
  initializeReservationData,
  registration,
}) => {
  const callbacksDisabled = useRef(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const disableCallbacks = useCallback(() => {
    callbacksDisabled.current = true;
  }, []);

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
    <ReservationTimerContext.Provider
      value={{
        callbacksDisabled: callbacksDisabled.current,
        disableCallbacks,
        registration,
        timeLeft,
      }}
    >
      {children}
    </ReservationTimerContext.Provider>
  );
};
