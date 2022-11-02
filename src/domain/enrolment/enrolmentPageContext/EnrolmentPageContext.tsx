import React, { createContext, FC, PropsWithChildren, useState } from 'react';

export type EnrolmentPageContextProps = {
  openParticipant: number | null;
  setOpenParticipant: (index: number | null) => void;
  toggleOpenParticipant: (index: number) => void;
};

export const EnrolmentPageContext = createContext<
  EnrolmentPageContextProps | undefined
>(undefined);

export const EnrolmentPageProvider: FC<PropsWithChildren> = ({ children }) => {
  const [openParticipant, setOpenParticipant] = useState<number | null>(0);

  const toggleOpenParticipant = (newIndex: number) => {
    setOpenParticipant(openParticipant === newIndex ? null : newIndex);
  };

  return (
    <EnrolmentPageContext.Provider
      value={{
        openParticipant,
        setOpenParticipant,
        toggleOpenParticipant,
      }}
    >
      {children}
    </EnrolmentPageContext.Provider>
  );
};
