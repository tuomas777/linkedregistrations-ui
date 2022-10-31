import isPast from 'date-fns/isPast';
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from 'react';

import { Registration } from '../../registration/types';
import { useReserveSeatsMutation } from '../../reserveSeats/mutation';
import {
  getRegistrationTimeLeft,
  getSeatsReservationData,
  setSeatsReservationData,
} from '../../reserveSeats/utils';

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

  const reserveSeatsMutation = useReserveSeatsMutation({
    onError: (error, variables) => {
      reportError({
        data: {
          error: JSON.parse(error.message),
          payload: variables,
          payloadAsString: JSON.stringify(variables),
        },
        message: 'Failed to reserve seats',
      });
    },
    onSuccess: (data) => {
      setSeatsReservationData(registration.id, data);
    },
  });

  const disableCallbacks = useCallback(() => {
    callbacksDisabled.current = true;
  }, []);

  React.useEffect(() => {
    const data = getSeatsReservationData(registration.id);

    if (initializeReservationData && (!data || isPast(data.expires * 1000))) {
      reserveSeatsMutation.mutate({
        registration: registration.id,
        seats: 1,
        waitlist: true,
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
