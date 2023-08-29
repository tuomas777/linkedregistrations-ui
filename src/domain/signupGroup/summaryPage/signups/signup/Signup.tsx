import { IconUser } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import TextArea from '../../../../../common/components/textArea/TextArea';
import { ATTENDEE_FIELDS } from '../../../../enrolment/constants';
import Divider from '../../../../enrolment/divider/Divider';
import InWaitingListInfo from '../../../../enrolment/inWaitingListInfo/InWaitingListInfo';
import { AttendeeFields } from '../../../../enrolment/types';
import ReadOnlyTextInput from '../../readOnlyTextInput/ReadOnlyTextInput';
import styles from './signup.module.scss';

export type SignupProps = {
  signup: AttendeeFields;
  signupPath: string;
};

const Signup: React.FC<SignupProps> = ({ signup, signupPath }) => {
  const { t } = useTranslation('summary');

  const getFieldId = (field: string) => `${signupPath}.${field}`;

  const getFieldText = (value: string) => value || '-';

  return (
    <div>
      <Divider />
      <div className={styles.iconRow}>
        <IconUser aria-hidden className={styles.icon} size="m" />
        {signup.inWaitingList && <InWaitingListInfo />}
      </div>
      <FormGroup>
        <div className={styles.nameRow}>
          <ReadOnlyTextInput
            id={getFieldId(ATTENDEE_FIELDS.FIRST_NAME)}
            label={t(`labelFirstName`)}
            value={getFieldText(signup.firstName)}
          />
          <ReadOnlyTextInput
            id={getFieldId(ATTENDEE_FIELDS.LAST_NAME)}
            label={t(`labelLastName`)}
            value={getFieldText(signup.lastName)}
          />
        </div>
      </FormGroup>
      <FormGroup>
        <div className={styles.streetAddressRow}>
          <ReadOnlyTextInput
            id={getFieldId(ATTENDEE_FIELDS.DATE_OF_BIRTH)}
            label={t(`labelDateOfBirth`)}
            value={getFieldText(signup.dateOfBirth)}
          />
          <ReadOnlyTextInput
            id={getFieldId(ATTENDEE_FIELDS.STREET_ADDRESS)}
            label={t(`labelStreetAddress`)}
            value={getFieldText(signup.streetAddress)}
          />
        </div>
      </FormGroup>
      <FormGroup>
        <div className={styles.zipRow}>
          <ReadOnlyTextInput
            id={getFieldId(ATTENDEE_FIELDS.ZIPCODE)}
            label={t(`labelZipcode`)}
            value={getFieldText(signup.zipcode)}
          />
          <ReadOnlyTextInput
            id={getFieldId(ATTENDEE_FIELDS.CITY)}
            label={t(`labelCity`)}
            value={getFieldText(signup.city)}
          />
        </div>
      </FormGroup>
      <TextArea
        id={getFieldId(ATTENDEE_FIELDS.EXTRA_INFO)}
        className={styles.textArea}
        readOnly
        label={t(`labelAttendeeExtraInfo`)}
        value={getFieldText(signup.extraInfo)}
      />
    </div>
  );
};

export default Signup;
