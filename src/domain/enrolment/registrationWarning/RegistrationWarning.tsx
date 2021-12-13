import { Notification } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { Registration } from '../../registration/types';
import { getRegistrationWarning } from '../../registration/utils';
import styles from './registrationWarning.module.scss';

type Props = {
  registration: Registration;
};

const RegistrationWarning: React.FC<Props> = ({ registration }) => {
  const { t } = useTranslation(['enrolment']);
  const registrationWarning = getRegistrationWarning(registration, t);

  return registrationWarning ? (
    <Notification className={styles.warning}>
      {registrationWarning}
    </Notification>
  ) : null;
};

export default RegistrationWarning;
