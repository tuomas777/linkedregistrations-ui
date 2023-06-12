import React from 'react';

import useLocale from '../../../hooks/useLocale';
import { Registration } from '../../registration/types';
import { getRegistrationFields } from '../../registration/utils';

type Props = {
  registration: Registration;
};

const ConfirmationMessage: React.FC<Props> = ({ registration }) => {
  const locale = useLocale();
  const { confirmationMessage } = getRegistrationFields(registration, locale);
  const confirmationMessageParts = confirmationMessage.split('\n');

  return (
    <>
      {confirmationMessageParts.map((part) => (
        <p key={part}>{part}</p>
      ))}
    </>
  );
};

export default ConfirmationMessage;
