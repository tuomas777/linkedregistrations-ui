import { Notification } from 'hds-react';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import Button from '../../../common/components/button/Button';
import styles from './authenticationRequiredNotification.module.scss';

const AuthenticationRequiredNotification: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <Notification className={styles.notification} label={t('common:signIn')}>
      <div>{t('common:signInToEnrol')}</div>
      <Button
        className={styles.button}
        onClick={() => signIn('tunnistamo')}
        type="button"
        variant="primary"
      >
        {t('signIn')}
      </Button>
    </Notification>
  );
};

export default AuthenticationRequiredNotification;
