import { IconUser } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import TextArea from '../../../../../common/components/textArea/TextArea';
import { featureFlagUtils } from '../../../../../utils/featureFlags';
import { Registration } from '../../../../registration/types';
import { SIGNUP_FIELDS } from '../../../constants';
import Divider from '../../../divider/Divider';
import useSignupPriceGroupOptions from '../../../hooks/useSignupPriceGroupOptions';
import InWaitingListInfo from '../../../inWaitingListInfo/InWaitingListInfo';
import { SignupFormFields } from '../../../types';
import ReadOnlyTextInput from '../../readOnlyTextInput/ReadOnlyTextInput';

import styles from './signup.module.scss';

export type SignupProps = {
  registration: Registration;
  signup: SignupFormFields;
  signupPath: string;
};

const Signup: React.FC<SignupProps> = ({
  registration,
  signup,
  signupPath,
}) => {
  const { t } = useTranslation('summary');

  const priceGroupOptions = useSignupPriceGroupOptions(registration);
  const priceGroupText = priceGroupOptions?.find(
    (o) => o.value === signup.priceGroup
  )?.label;

  const getFieldId = (field: string) => `${signupPath}.${field}`;

  const getFieldText = (value: string) => value || '-';

  return (
    <div>
      <Divider />
      <div className={styles.iconRow}>
        <IconUser aria-hidden className={styles.icon} size="m" />
        {featureFlagUtils.isFeatureEnabled('WEB_STORE_INTEGRATION') &&
          priceGroupText &&
          [priceGroupText, signup.inWaitingList ? ' — ' : ''].join('')}
        {signup.inWaitingList && <InWaitingListInfo />}
      </div>
      <FormGroup>
        <div className={styles.nameRow}>
          <ReadOnlyTextInput
            id={getFieldId(SIGNUP_FIELDS.FIRST_NAME)}
            label={t(`signup.labelFirstName`)}
            value={getFieldText(signup.firstName)}
          />
          <ReadOnlyTextInput
            id={getFieldId(SIGNUP_FIELDS.LAST_NAME)}
            label={t(`signup.labelLastName`)}
            value={getFieldText(signup.lastName)}
          />
        </div>
      </FormGroup>
      <FormGroup>
        <div className={styles.streetAddressRow}>
          <ReadOnlyTextInput
            id={getFieldId(SIGNUP_FIELDS.DATE_OF_BIRTH)}
            label={t(`signup.labelDateOfBirth`)}
            value={getFieldText(signup.dateOfBirth)}
          />
          <ReadOnlyTextInput
            id={getFieldId(SIGNUP_FIELDS.STREET_ADDRESS)}
            label={t(`signup.labelStreetAddress`)}
            value={getFieldText(signup.streetAddress)}
          />
        </div>
      </FormGroup>
      <FormGroup>
        <div className={styles.zipRow}>
          <ReadOnlyTextInput
            id={getFieldId(SIGNUP_FIELDS.ZIPCODE)}
            label={t(`signup.labelZipcode`)}
            value={getFieldText(signup.zipcode)}
          />
          <ReadOnlyTextInput
            id={getFieldId(SIGNUP_FIELDS.CITY)}
            label={t(`signup.labelCity`)}
            value={getFieldText(signup.city)}
          />
        </div>
      </FormGroup>
      <TextArea
        id={getFieldId(SIGNUP_FIELDS.EXTRA_INFO)}
        className={styles.textArea}
        readOnly
        label={t(`signup.labelExtraInfo`)}
        value={getFieldText(signup.extraInfo)}
      />
    </div>
  );
};

export default Signup;
