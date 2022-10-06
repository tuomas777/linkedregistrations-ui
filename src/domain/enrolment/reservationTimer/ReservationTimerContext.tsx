import React, {
  Dispatch,
  FC,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from 'react';

export type ReservationTimerContextProps = {
  callbacksDisabled: boolean;
  disableCallbacks: () => void;
  setTimeLeft: Dispatch<SetStateAction<number | null>>;
  timeLeft: number | null;
};

export const ReservationTimerContext = React.createContext<
  ReservationTimerContextProps | undefined
>(undefined);

export const ReservationTimerProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const callbacksDisabled = useRef(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const disableCallbacks = useCallback(() => {
    callbacksDisabled.current = true;
  }, []);

  return (
    <ReservationTimerContext.Provider
      value={{
        callbacksDisabled: callbacksDisabled.current,
        disableCallbacks,
        setTimeLeft,
        timeLeft,
      }}
    >
      {children}
    </ReservationTimerContext.Provider>
  );
};
