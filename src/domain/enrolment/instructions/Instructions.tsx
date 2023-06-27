import React from 'react';
import { useTranslation } from 'react-i18next';

import useLocale from '../../../hooks/useLocale';
import { Registration } from '../../registration/types';
import { getRegistrationFields } from '../../registration/utils';

type Props = {
  registration: Registration;
};

const Instructions: React.FC<Props> = ({ registration }) => {
  const { t } = useTranslation('enrolment');
  const locale = useLocale();
  const { instructions } = getRegistrationFields(registration, locale);
  const instructionsParts = instructions.split('\n');

  if (!instructions) {
    return null;
  }

  return (
    <>
      <strong>{t('enrolment:instructions')}</strong>
      {instructionsParts.map((part) => (
        <p key={part}>{part}</p>
      ))}
    </>
  );
};

export default Instructions;
