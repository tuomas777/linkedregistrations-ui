import { Field, Form, Formik } from 'formik';
import { Fieldset, Notification } from 'hds-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';
import { ValidationError } from 'yup';
import 'react-toastify/dist/ReactToastify.css';

import Button from '../../../common/components/button/Button';
import CheckboxField from '../../../common/components/formFields/CheckboxField';
import CheckboxGroupField from '../../../common/components/formFields/CheckboxGroupField';
import DateInputField from '../../../common/components/formFields/DateInputField';
import PhoneInputField from '../../../common/components/formFields/PhoneInputField';
import SingleSelectField from '../../../common/components/formFields/SingleSelectField';
import TextAreaField from '../../../common/components/formFields/TextAreaField';
import TextInputField from '../../../common/components/formFields/TextInputField';
import FormGroup from '../../../common/components/formGroup/FormGroup';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import useLocale from '../../../hooks/useLocale';
import { ROUTES } from '../../app/routes/constants';
import { Registration } from '../../registration/types';
import {
  getRegistrationWarning,
  isRegistrationPossible,
} from '../../registration/utils';
import { ENROLMENT_FIELDS, NOTIFICATIONS } from '../constants';
import useEnrolmentServerErrors from '../hooks/useEnrolmentServerErrors';
import useLanguageOptions from '../hooks/useLanguageOptions';
import useNotificationOptions from '../hooks/useNotificationOptions';
import { useCreateEnrolmentMutation } from '../mutation';
import { Enrolment } from '../types';
import { getEnrolmentFormInitialValues, getEnrolmentPayload } from '../utils';
import { enrolmentSchema, scrollToFirstError, showErrors } from '../validation';
import styles from './enrolmentForm.module.scss';
import RegistrationWarning from '../registrationWarning/RegistrationWarning';

type Props = {
  registration: Registration;
};

const EnrolmentForm: React.FC<Props> = ({ registration }) => {
  const { t } = useTranslation(['enrolment', 'common']);
  const notificationOptions = useNotificationOptions();
  const languageOptions = useLanguageOptions();
  const formDisabled = !isRegistrationPossible(registration);
  const locale = useLocale();
  const router = useRouter();

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrors();

  const goToEnrolmentCompletedPage = (enrolment: Enrolment) => {
    router.push(
      `/${locale}${ROUTES.ENROLMENT_COMPLETED.replace(
        '[registrationId]',
        registration.id
      )
        .replace('[enrolmentId]', enrolment.id)
        .replace('[accessCode]', enrolment.cancellation_code as string)}`
    );
  };
  const createEnrolmentMutation = useCreateEnrolmentMutation({
    onError: (error) => {
      showServerErrors({ error: JSON.parse(error.message) });
    },
    onSuccess: (data) => {
      goToEnrolmentCompletedPage(data);
    },
  });

  const registrationWarning = getRegistrationWarning(registration, t);

  const initialValues = getEnrolmentFormInitialValues(registration);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={/* istanbul ignore next */ () => undefined}
      validationSchema={enrolmentSchema}
    >
      {({ setErrors, setTouched, values }) => {
        const clearErrors = () => setErrors({});

        const handleSubmit = async () => {
          try {
            setServerErrorItems([]);
            clearErrors();

            await enrolmentSchema.validate(values, { abortEarly: false });
            const payload = getEnrolmentPayload(values, registration);

            createEnrolmentMutation.mutate(payload);
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
            <ServerErrorSummary errors={serverErrorItems} />
            <RegistrationWarning registration={registration} />
            <Fieldset heading={t(`titleBasicInfo`)}>
              <FormGroup>
                <Field
                  name={ENROLMENT_FIELDS.NAME}
                  component={TextInputField}
                  disabled={formDisabled}
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
                    disabled={formDisabled}
                    label={t(`labelStreetAddress`)}
                    placeholder={t(`placeholderStreetAddress`)}
                    required
                  />
                  <Field
                    name={ENROLMENT_FIELDS.DATE_OF_BIRTH}
                    component={DateInputField}
                    disabled={formDisabled}
                    label={t(`labelDateOfBirth`)}
                    language={locale}
                    maxDate={new Date()}
                    minDate={
                      new Date(`${new Date().getFullYear() - 100}-01-01`)
                    }
                    placeholder={t(`placeholderDateOfBirth`)}
                    required
                  />
                </div>
              </FormGroup>
              <FormGroup>
                <div className={styles.zipRow}>
                  <Field
                    name={ENROLMENT_FIELDS.ZIP}
                    component={TextInputField}
                    disabled={formDisabled}
                    label={t(`labelZip`)}
                    placeholder={t(`placeholderZip`)}
                    required
                  />
                  <Field
                    name={ENROLMENT_FIELDS.CITY}
                    component={TextInputField}
                    disabled={formDisabled}
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
                    disabled={formDisabled}
                    label={t(`labelEmail`)}
                    placeholder={t(`placeholderEmail`)}
                    required={values.notifications.includes(
                      NOTIFICATIONS.EMAIL
                    )}
                  />
                  <Field
                    name={ENROLMENT_FIELDS.PHONE_NUMBER}
                    component={PhoneInputField}
                    disabled={formDisabled}
                    label={t(`labelPhoneNumber`)}
                    placeholder={t(`placeholderPhoneNumber`)}
                    type="tel"
                    required={values.notifications.includes(NOTIFICATIONS.SMS)}
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
                  disabled={formDisabled}
                  options={notificationOptions}
                />
              </FormGroup>
            </Fieldset>

            <Fieldset heading={t(`titleAdditionalInfo`)}>
              <FormGroup>
                <div className={styles.membershipNumberRow}>
                  <Field
                    name={ENROLMENT_FIELDS.MEMBERSHIP_NUMBER}
                    component={TextInputField}
                    disabled={formDisabled}
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
                    disabled={formDisabled}
                    label={t(`labelNativeLanguage`)}
                    options={languageOptions}
                    placeholder={t(`placeholderNativeLanguage`)}
                    required
                  />
                  <Field
                    name={ENROLMENT_FIELDS.SERVICE_LANGUAGE}
                    component={SingleSelectField}
                    disabled={formDisabled}
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
                  disabled={formDisabled}
                  label={t(`labelExtraInfo`)}
                  placeholder={t(`placeholderExtraInfo`)}
                />
              </FormGroup>
            </Fieldset>
            <FormGroup>
              <Field
                disabled={formDisabled}
                label={t(`labelAccepted`)}
                name={ENROLMENT_FIELDS.ACCEPTED}
                component={CheckboxField}
              />
            </FormGroup>

            <Notification
              className={styles.notification}
              label={t('notificationTitle')}
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
              <Button
                className={styles.button}
                disabled={formDisabled}
                onClick={handleSubmit}
              >
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
