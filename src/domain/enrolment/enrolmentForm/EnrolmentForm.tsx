import { Field, Formik } from 'formik';
import { useTranslation } from 'next-i18next';
import React from 'react';

import PhoneInputField from '../../../common/components/formFields/PhoneInputField';
import SingleSelectField from '../../../common/components/formFields/SingleSelectField';
import TextAreaField from '../../../common/components/formFields/TextAreaField';
import TextInputField from '../../../common/components/formFields/TextInputField';
import FormGroup from '../../../common/components/formGroup/FormGroup';
import { ENROLMENT_FIELDS, ENROLMENT_INITIAL_VALUES } from '../constants';
import useYearOptions from '../hooks/useYearOptions';
import styles from './enrolmentForm.module.scss';

const EnrolmentForm: React.FC = () => {
  const { t } = useTranslation('enrolment');
  const yearOptions = useYearOptions();

  return (
    <Formik
      initialValues={ENROLMENT_INITIAL_VALUES}
      onSubmit={/* istanbul ignore next */ () => undefined}
    >
      {() => {
        return (
          <>
            <h3>{t(`titleBasicInfo`)}</h3>
            <FormGroup>
              <Field
                name={ENROLMENT_FIELDS.NAME}
                component={TextInputField}
                label={t(`labelName`)}
                placeholder={t(`placeholderName`)}
                required
              />
            </FormGroup>
            <FormGroup>
              <div className={styles.streetAddressRow}>
                <Field
                  name={ENROLMENT_FIELDS.STREET_ADDRESS}
                  component={TextInputField}
                  label={t(`labelStreetAddress`)}
                  placeholder={t(`placeholderStreetAddress`)}
                  required
                />
                <Field
                  name={ENROLMENT_FIELDS.YEAR_OF_BIRTH}
                  component={SingleSelectField}
                  label={t(`labelYearOfBirth`)}
                  options={yearOptions}
                  placeholder={t(`placeholderYearOfBirth`)}
                  required
                />
              </div>
            </FormGroup>
            <FormGroup>
              <div className={styles.zipRow}>
                <Field
                  name={ENROLMENT_FIELDS.ZIP}
                  component={TextInputField}
                  label={t(`labelZip`)}
                  placeholder={t(`placeholderZip`)}
                  required
                />
                <Field
                  name={ENROLMENT_FIELDS.CITY}
                  component={TextInputField}
                  label={t(`labelCity`)}
                  placeholder={t(`placeholderCity`)}
                  required
                />
              </div>
            </FormGroup>

            <h3>{t(`titleContactInfo`)}</h3>
            <FormGroup>
              <div className={styles.emailRow}>
                <Field
                  name={ENROLMENT_FIELDS.EMAIL}
                  component={TextInputField}
                  label={t(`labelEmail`)}
                  placeholder={t(`placeholderEmail`)}
                  required
                />
                <Field
                  name={ENROLMENT_FIELDS.PHONE_NUMBER}
                  component={PhoneInputField}
                  label={t(`labelPhoneNumber`)}
                  placeholder={t(`placeholderPhoneNumber`)}
                  type="tel"
                />
              </div>
            </FormGroup>

            <h3>{t(`titleAdditionalInfo`)}</h3>
            <FormGroup>
              <div className={styles.membershipNumberRow}>
                <Field
                  name={ENROLMENT_FIELDS.MEMBERSHIP_NUMBER}
                  component={TextInputField}
                  label={t(`labelMembershipNumber`)}
                  placeholder={t(`placeholderMembershipNumber`)}
                />
              </div>
            </FormGroup>
            <FormGroup>
              <Field
                name={ENROLMENT_FIELDS.EXTRA_INFO}
                component={TextAreaField}
                label={t(`labelExtraInfo`)}
                placeholder={t(`placeholderExtraInfo`)}
              />
            </FormGroup>
          </>
        );
      }}
    </Formik>
  );
};

export default EnrolmentForm;
