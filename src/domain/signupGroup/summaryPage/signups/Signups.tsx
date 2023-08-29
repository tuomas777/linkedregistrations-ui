import { useField } from 'formik';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { ENROLMENT_FIELDS } from '../../../enrolment/constants';
import { AttendeeFields } from '../../../enrolment/types';
import Attendee from './signup/Signup';
import styles from './signups.module.scss';

const getSignupPath = (index: number) =>
  `${ENROLMENT_FIELDS.ATTENDEES}[${index}]`;

const Signups: React.FC = () => {
  const { t } = useTranslation('summary');

  const [{ value: signups }] = useField<AttendeeFields[]>({
    name: ENROLMENT_FIELDS.ATTENDEES,
  });

  return (
    <div className={styles.signups}>
      <h2>{t('titleAttendeesInfo')}</h2>
      {signups.map((attendee, index) => {
        return (
          <Attendee
            key={index}
            signup={attendee}
            signupPath={getSignupPath(index)}
          />
        );
      })}
    </div>
  );
};

export default Signups;
