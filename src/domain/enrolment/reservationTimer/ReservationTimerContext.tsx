import pick from 'lodash/pick';
import { useRouter } from 'next/router';
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ROUTES } from '../../app/routes/constants';
import { Registration } from '../../registration/types';
import {
  getRegistrationTimeLeft,
  getSeatsReservationData,
  isSeatsReservationExpired,
} from '../../reserveSeats/utils';
import { ENROLMENT_MODALS, ENROLMENT_QUERY_PARAMS } from '../constants';
import { useEnrolmentPageContext } from '../enrolmentPageContext/hooks/useEnrolmentPageContext';
import { useEnrolmentServerErrorsContext } from '../enrolmentServerErrorsContext/hooks/useEnrolmentServerErrorsContext';
import useSeatsReservationActions from '../hooks/useSeatsReservationActions';
import ReservationTimeExpiredModal from '../modals/reservationTimeExpiredModal/ReservationTimeExpiredModal';
import { AttendeeFields } from '../types';
import {
  clearCreateEnrolmentFormData,
  clearEnrolmentReservationData,
} from '../utils';

export type ReservationTimerContextProps = {
  disableCallbacks: () => void;
  registration: Registration;
  timeLeft: number | null;
};

export const ReservationTimerContext = React.createContext<
  ReservationTimerContextProps | undefined
>(undefined);

interface Props {
  attendees: AttendeeFields[];
  initializeReservationData: boolean;
  registration: Registration;
  setAttendees: (value: AttendeeFields[]) => void;
}

export const ReservationTimerProvider: FC<PropsWithChildren<Props>> = ({
  attendees,
  children,
  initializeReservationData,
  registration,
  setAttendees,
}) => {
  const { openModal, setOpenModal } = useEnrolmentPageContext();
  const { setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrorsContext();
  const router = useRouter();
  const creatingReservationStarted = useRef(false);
  const callbacksDisabled = useRef(false);
  const timerEnabled = useRef(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const enableTimer = useCallback(() => {
    timerEnabled.current = true;
  }, []);
  const { createSeatsReservation } = useSeatsReservationActions({
    attendees,
    registration,
    setAttendees,
  });

  const disableCallbacks = useCallback(() => {
    callbacksDisabled.current = true;
  }, []);

  const goToPage = (pathname: string) => {
    router.push({
      pathname,
      query: pick(router.query, [
        ENROLMENT_QUERY_PARAMS.IFRAME,
        ENROLMENT_QUERY_PARAMS.REDIRECT_URL,
      ]),
    });
  };

  const handleTryAgain = () => {
    if (router.pathname === ROUTES.CREATE_ENROLMENT) {
      router.reload();
    } else {
      goToPage(
        ROUTES.CREATE_ENROLMENT.replace(
          '[registrationId]',
          router.query.registrationId as string
        )
      );
    }
  };

  React.useEffect(() => {
    const data = getSeatsReservationData(registration.id);

    if (
      initializeReservationData &&
      !creatingReservationStarted.current &&
      !data
    ) {
      creatingReservationStarted.current = true;
      // Clear server errors
      setServerErrorItems([]);

      createSeatsReservation({
        onError: (error) =>
          showServerErrors(
            { error: JSON.parse(error.message) },
            'seatsReservation'
          ),
        onSuccess: (seatsReservation) => {
          enableTimer();
          if (seatsReservation) {
            setTimeLeft(getRegistrationTimeLeft(seatsReservation));
          }
        },
      });
      // useEffect runs twice in React v18.0, so start creatin nre seats reservation
      // only if creatingReservationStarted is false
    } else if (data) {
      enableTimer();
      setTimeLeft(getRegistrationTimeLeft(data));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const interval = setInterval(() => {
      /* istanbul ignore else */
      if (timerEnabled.current) {
        const data = getSeatsReservationData(registration.id);
        setTimeLeft(getRegistrationTimeLeft(data));

        /* istanbul ignore else */
        if (!callbacksDisabled.current) {
          if (!data || isSeatsReservationExpired(data)) {
            disableCallbacks();

            clearCreateEnrolmentFormData(registration.id);
            clearEnrolmentReservationData(registration.id);

            setOpenModal(ENROLMENT_MODALS.RESERVATION_TIME_EXPIRED);
          }
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [disableCallbacks, registration, setOpenModal, setTimeLeft, timeLeft]);

  const value = useMemo(
    () => ({
      disableCallbacks,
      registration,
      timeLeft,
    }),
    [disableCallbacks, registration, timeLeft]
  );

  return (
    <ReservationTimerContext.Provider value={value}>
      <ReservationTimeExpiredModal
        isOpen={openModal === ENROLMENT_MODALS.RESERVATION_TIME_EXPIRED}
        onTryAgain={handleTryAgain}
      />
      {children}
    </ReservationTimerContext.Provider>
  );
};
