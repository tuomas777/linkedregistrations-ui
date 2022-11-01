import pick from 'lodash/pick';
import { useRouter } from 'next/router';
import React, {
  FC,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-toastify';

import { ROUTES } from '../../app/routes/constants';
import { reportError } from '../../app/sentry/utils';
import { Registration } from '../../registration/types';
import { useReserveSeatsMutation } from '../../reserveSeats/mutation';
import {
  getRegistrationTimeLeft,
  getSeatsReservationData,
  isSeatsReservationExpired,
  setSeatsReservationData,
} from '../../reserveSeats/utils';
import { ENROLMENT_QUERY_PARAMS } from '../constants';
import ReservationTimeExpiredModal from '../modals/reservationTimeExpiredModal/ReservationTimeExpiredModal';
import {
  clearCreateEnrolmentFormData,
  clearEnrolmentReservationData,
} from '../utils';

export type ReservationTimerContextProps = {
  disableCallbacks: () => void;
  isModalOpen: boolean;
  registration: Registration;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
  const router = useRouter();
  const callbacksDisabled = useRef(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const reserveSeatsMutation = useReserveSeatsMutation({
    onError: (error, variables) => {
      toast.error('Failed to reserve seats');

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

    if (initializeReservationData && !data) {
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

      const data = getSeatsReservationData(registration.id);

      /* istanbul ignore else */
      if (!callbacksDisabled.current) {
        if (!data || isSeatsReservationExpired(data)) {
          disableCallbacks();

          clearCreateEnrolmentFormData(registration.id);
          clearEnrolmentReservationData(registration.id);

          setIsModalOpen(true);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [disableCallbacks, registration, setTimeLeft, timeLeft]);

  return (
    <ReservationTimerContext.Provider
      value={{
        disableCallbacks,
        isModalOpen,
        registration,
        setIsModalOpen,
        timeLeft,
      }}
    >
      <ReservationTimeExpiredModal
        isOpen={isModalOpen}
        onTryAgain={handleTryAgain}
      />
      {children}
    </ReservationTimerContext.Provider>
  );
};
