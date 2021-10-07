import { Field, Form, Formik } from 'formik';
import { Fieldset, Notification } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { toast } from 'react-toastify';
import { ValidationError } from 'yup';
import 'react-toastify/dist/ReactToastify.css';

import Button from '../../../common/components/button/Button';
import CheckboxField from '../../../common/components/formFields/CheckboxField';
import CheckboxGroupField from '../../../common/components/formFields/CheckboxGroupField';
import PhoneInputField from '../../../common/components/formFields/PhoneInputField';
import SingleSelectField from '../../../common/components/formFields/SingleSelectField';
import TextAreaField from '../../../common/components/formFields/TextAreaField';
import TextInputField from '../../../common/components/formFields/TextInputField';
import FormGroup from '../../../common/components/formGroup/FormGroup';
import {
  ENROLMENT_FIELDS,
  ENROLMENT_INITIAL_VALUES,
  NOTIFICATIONS,
} from '../constants';
import useLanguageOptions from '../hooks/useLanguageOptions';
import useNotificationOptions from '../hooks/useNotificationOptions';
import useYearOptions from '../hooks/useYearOptions';
import { enrolmentSchema, scrollToFirstError, showErrors } from '../validation';
import styles from './enrolmentForm.module.scss';

const EnrolmentForm: React.FC = () => {
  const { t } = useTranslation(['enrolment', 'common']);
  const notificationOptions = useNotificationOptions();
  const yearOptions = useYearOptions();
  const languageOptions = useLanguageOptions();

  return (
    <Formik
      initialValues={ENROLMENT_INITIAL_VALUES}
      onSubmit={/* istanbul ignore next */ () => undefined}
      validationSchema={enrolmentSchema}
    >
      {({ setErrors, setTouched, values }) => {
        const clearErrors = () => setErrors({});

        const handleSubmit = async () => {
          try {
            clearErrors();

            await enrolmentSchema.validate(values, { abortEarly: false });

            toast.error('TODO: Save enrolment');
          } catch (error) {
            showErrors({
              error: error as ValidationError,
              setErrors,
              setTouched,
            });

            scrollToFirstError({ error: error as ValidationError });
          }
        };

        return (
          <Form noValidate>
            <Fieldset heading={t(`titleBasicInfo`)}>
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
            </Fieldset>

            <Fieldset heading={t(`titleContactInfo`)}>
              <FormGroup>
                <div className={styles.emailRow}>
                  <Field
                    name={ENROLMENT_FIELDS.EMAIL}
                    component={TextInputField}
                    label={t(`labelEmail`)}
                    placeholder={t(`placeholderEmail`)}
                    required={values.notifications.includes(
                      NOTIFICATIONS.EMAIL
                    )}
                  />
                  <Field
                    name={ENROLMENT_FIELDS.PHONE_NUMBER}
                    component={PhoneInputField}
                    label={t(`labelPhoneNumber`)}
                    placeholder={t(`placeholderPhoneNumber`)}
                    type="tel"
                    required={values.notifications.includes(
                      NOTIFICATIONS.PHONE
                    )}
                  />
                </div>
              </FormGroup>
            </Fieldset>

            <Fieldset heading={t(`titleNotifications`)}>
              <FormGroup>
                <Field
                  name={ENROLMENT_FIELDS.NOTIFICATIONS}
                  className={styles.notifications}
                  component={CheckboxGroupField}
                  options={notificationOptions}
                />
              </FormGroup>
              <FormGroup>
                <div className={styles.notificationLanguageRow}>
                  <Field
                    name={ENROLMENT_FIELDS.NOTIFICATION_LANGUAGE}
                    component={SingleSelectField}
                    label={t(`labelNotificationLanguage`)}
                    options={languageOptions}
                    placeholder={t(`placeholderNotificationLanguage`)}
                    required
                  />
                </div>
              </FormGroup>
            </Fieldset>

            <Fieldset heading={t(`titleAdditionalInfo`)}>
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
                <div className={styles.nativeLanguageRow}>
                  <Field
                    name={ENROLMENT_FIELDS.NATIVE_LANGUAGE}
                    component={SingleSelectField}
                    label={t(`labelNativeLanguage`)}
                    options={languageOptions}
                    placeholder={t(`placeholderNativeLanguage`)}
                    required
                  />
                  <Field
                    name={ENROLMENT_FIELDS.SERVICE_LANGUAGE}
                    component={SingleSelectField}
                    label={t(`labelServiceLanguage`)}
                    options={languageOptions}
                    placeholder={t(`placeholderServiceLanguage`)}
                    required
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
            </Fieldset>
            <FormGroup>
              <Field
                label={t(`labelAccepted`)}
                name={ENROLMENT_FIELDS.ACCEPTED}
                component={CheckboxField}
              />
            </FormGroup>

            <Notification
              className={styles.notification}
              label="Ilmoittautumisen vahvistaminen"
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: t('notificationLabel', {
                    openInNewTab: t('common:openInNewTab'),
                    url: t('linkPrivacyPolicy'),
                  }),
                }}
              ></div>
            </Notification>
            <div className={styles.buttonWrapper}>
              <Button className={styles.button} onClick={handleSubmit}>
                {t('buttonSend')}
              </Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default EnrolmentForm;
