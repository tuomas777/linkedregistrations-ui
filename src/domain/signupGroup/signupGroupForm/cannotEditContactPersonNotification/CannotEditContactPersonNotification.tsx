import Link from 'next/link';
import { useRouter } from 'next/router';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Notification from '../../../../common/components/notification/Notification';
import { ROUTES } from '../../../app/routes/constants';
import { Signup } from '../../../signup/types';
import { SIGNUPS_SEARCH_PARAMS } from '../../../singups/constants';

import styles from './cannotEditContactPersonNotification.module.scss';

type Props = {
  signup: Signup;
};

const CannotEditContactPersonNotification: FC<Props> = ({ signup }) => {
  const { t } = useTranslation('signup');
  const router = useRouter();

  return (
    <Notification
      className={styles.cannotEditNotification}
      label={t(
        'signup:contactPerson.cannotEditContactPersonNotification.title'
      )}
      type="info"
    >
      <p>
        {t('signup:contactPerson.cannotEditContactPersonNotification.text')}
      </p>
      {signup.signup_group && (
        <Link
          href={{
            pathname: ROUTES.EDIT_SIGNUP_GROUP,
            query: {
              ...router.query,
              [SIGNUPS_SEARCH_PARAMS.RETURN_PATH]: router.asPath,
              signupGroupId: signup.signup_group,
            },
          }}
        >
          {t(
            'signup:contactPerson.cannotEditContactPersonNotification.linkText'
          )}
        </Link>
      )}
    </Notification>
  );
};

export default CannotEditContactPersonNotification;
