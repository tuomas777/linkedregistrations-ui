import React, {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useMemo,
  useState,
} from 'react';

import useMountedState from '../../../hooks/useMountedState';
import { SIGNUP_MODALS } from '../../signup/constants';
import PersonsAddedToWaitingListModal from '../modals/personsAddedToWaitingListModal/PersonsAddedToWaitingListModal';

export type EnrolmentPageContextProps = {
  closeModal: () => void;
  openModal: SIGNUP_MODALS | null;
  openParticipant: number | null;
  setOpenModal: (state: SIGNUP_MODALS | null) => void;
  setOpenParticipant: (index: number | null) => void;
  toggleOpenParticipant: (index: number) => void;
};

export const EnrolmentPageContext = createContext<
  EnrolmentPageContextProps | undefined
>(undefined);

export const EnrolmentPageProvider: FC<PropsWithChildren> = ({ children }) => {
  const [openParticipant, setOpenParticipant] = useState<number | null>(0);

  const [openModal, setOpenModal] = useMountedState<SIGNUP_MODALS | null>(null);

  const toggleOpenParticipant = useCallback(
    (newIndex: number) => {
      setOpenParticipant(openParticipant === newIndex ? null : newIndex);
    },
    [openParticipant]
  );

  const value = useMemo(
    () => ({
      closeModal: () => setOpenModal(null),
      openModal,
      openParticipant,
      setOpenModal,
      setOpenParticipant,
      toggleOpenParticipant,
    }),
    [openModal, openParticipant, setOpenModal, toggleOpenParticipant]
  );

  return (
    <EnrolmentPageContext.Provider value={value}>
      <PersonsAddedToWaitingListModal
        isOpen={openModal === SIGNUP_MODALS.PERSONS_ADDED_TO_WAITLIST}
        onClose={() => setOpenModal(null)}
      />
      {children}
    </EnrolmentPageContext.Provider>
  );
};
