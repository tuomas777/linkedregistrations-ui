import { Field, FieldAttributes, Form, Formik } from 'formik';
import {
  Fieldset,
  IconCross,
  Notification,
  SingleSelectProps,
} from 'hds-react';
import pick from 'lodash/pick';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
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
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import useLocale from '../../../hooks/useLocale';
import useMountedState from '../../../hooks/useMountedState';
import { OptionType } from '../../../types';
import { ROUTES } from '../../app/routes/constants';
import { reportError } from '../../app/sentry/utils';
import { Registration } from '../../registration/types';
import { isRegistrationPossible } from '../../registration/utils';
import {
  ENROLMENT_FIELDS,
  ENROLMENT_QUERY_PARAMS,
  NOTIFICATIONS,
} from '../constants';
import EnrolmentPageContext from '../enrolmentPageContext/EnrolmentPageContext';
import useEnrolmentServerErrors from '../hooks/useEnrolmentServerErrors';
import useLanguageOptions from '../hooks/useLanguageOptions';
import useNotificationOptions from '../hooks/useNotificationOptions';
import ConfirmCancelModal from '../modals/ConfirmCancelModal';
import {
  useCreateEnrolmentMutation,
  useDeleteEnrolmentMutation,
} from '../mutation';
import ParticipantAmountSelector from '../participantAmountSelector/ParticipantAmountSelector';
import RegistrationWarning from '../registrationWarning/RegistrationWarning';
import { Enrolment, EnrolmentFormFields } from '../types';
import { getEnrolmentPayload } from '../utils';
import { enrolmentSchema, scrollToFirstError, showErrors } from '../validation';
import Attendees from './attendees/Attendees';
import styles from './enrolmentForm.module.scss';

export enum ENROLMENT_MODALS {
  CANCEL = 'cancel',
}

interface Callbacks {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onError?: (error: any) => void;
  onSuccess?: () => void;
}

const LanguageField = (
  props: FieldAttributes<Omit<SingleSelectProps<OptionType>, 'options'>>
) => {
  const languageOptions = useLanguageOptions();

  return (
    <Field {...props} component={SingleSelectField} options={languageOptions} />
  );
};

type Props = {
  cancellationCode?: string;
  initialValues: EnrolmentFormFields;
  readOnly?: boolean;
  registration: Registration;
};

const EnrolmentForm: React.FC<Props> = ({
  cancellationCode,
  initialValues,
  readOnly,
  registration,
}) => {
  const { t } = useTranslation(['enrolment', 'common']);

  const { setOpenParticipant } = useContext(EnrolmentPageContext);
  const [openModal, setOpenModal] = useMountedState<ENROLMENT_MODALS | null>(
    null
  );

  const closeModal = () => {
    setOpenModal(null);
  };

  const cleanAfterUpdate = async (callbacks?: Callbacks) => {
    closeModal();
    // Call callback function if defined
    await (callbacks?.onSuccess && callbacks.onSuccess());
  };

  const notificationOptions = useNotificationOptions();
  const formDisabled = !isRegistrationPossible(registration);
  const locale = useLocale();
  const router = useRouter();
  const { query } = router;

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrors();

  const goToPage = (pathname: string) => {
    router.push({
      pathname,
      query: pick(query, [
        ENROLMENT_QUERY_PARAMS.IFRAME,
        ENROLMENT_QUERY_PARAMS.REDIRECT_URL,
      ]),
    });
  };
  const goToEnrolmentCompletedPage = (enrolment: Enrolment) => {
    goToPage(
      `/${locale}${ROUTES.ENROLMENT_COMPLETED.replace(
        '[registrationId]',
        registration.id
      ).replace('[accessCode]', enrolment.cancellation_code as string)}`
    );
  };

  const goToEnrolmentCancelledPage = () => {
    goToPage(
      `/${locale}${ROUTES.ENROLMENT_CANCELLED.replace(
        '[registrationId]',
        registration.id
      )}`
    );
  };

  const createEnrolmentMutation = useCreateEnrolmentMutation({
    onError: (error, variables) => {
      showServerErrors({ error: JSON.parse(error.message) });
      reportError({
        data: {
          error: JSON.parse(error.message),
          payload: variables,
          payloadAsString: JSON.stringify(variables),
        },
        message: 'Failed to create enrolment',
      });
    },
    onSuccess: (data) => {
      goToEnrolmentCompletedPage(data);
    },
  });

  const deleteEnrolmentMutation = useDeleteEnrolmentMutation({
    onError: (error, variables) => {
      closeModal();

      showServerErrors({ error: JSON.parse(error.message) });
      // Report error to Sentry
      reportError({
        data: {
          error: JSON.parse(error.message),
          cancellationCode: variables,
        },
        message: 'Failed to cancel enrolment',
      });
    },
    onSuccess: () => {
      cleanAfterUpdate({ onSuccess: () => goToEnrolmentCancelledPage() });
    },
  });

  const handleCancel = () => {
    setServerErrorItems([]);
    deleteEnrolmentMutation.mutate(cancellationCode as string);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={/* istanbul ignore next */ () => undefined}
      validationSchema={readOnly ? undefined : enrolmentSchema}
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

            scrollToFirstError({
              error: error as ValidationError,
              setOpenAccordion: setOpenParticipant,
            });
          }
        };

        return (
          <>
            <ConfirmCancelModal
              isOpen={openModal === ENROLMENT_MODALS.CANCEL}
              onCancel={handleCancel}
              onClose={closeModal}
            />
            <Form noValidate>
              <ServerErrorSummary errors={serverErrorItems} />
              <RegistrationWarning registration={registration} />

              <div className={styles.divider} />
              <h2>{t('titleRegistration')}</h2>

              <ParticipantAmountSelector
                disabled={formDisabled || !!readOnly}
                registration={registration}
              />

              <Attendees formDisabled={formDisabled} readOnly={readOnly} />

              <Fieldset heading={t(`titleContactInfo`)}>
                <FormGroup>
                  <div className={styles.emailRow}>
                    <Field
                      name={ENROLMENT_FIELDS.EMAIL}
                      component={TextInputField}
                      disabled={formDisabled}
                      label={t(`labelEmail`)}
                      placeholder={readOnly ? '' : t(`placeholderEmail`)}
                      readOnly={readOnly}
                      required={values.notifications.includes(
                        NOTIFICATIONS.EMAIL
                      )}
                    />
                    <Field
                      name={ENROLMENT_FIELDS.PHONE_NUMBER}
                      component={PhoneInputField}
                      disabled={formDisabled}
                      label={t(`labelPhoneNumber`)}
                      placeholder={readOnly ? '' : t(`placeholderPhoneNumber`)}
                      readOnly={readOnly}
                      required={values.notifications.includes(
                        NOTIFICATIONS.SMS
                      )}
                      type="tel"
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
                    disabled={formDisabled || readOnly}
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
                      placeholder={
                        readOnly ? '' : t(`placeholderMembershipNumber`)
                      }
                      readOnly={readOnly}
                    />
                  </div>
                </FormGroup>
                <FormGroup>
                  <div className={styles.nativeLanguageRow}>
                    <LanguageField
                      name={ENROLMENT_FIELDS.NATIVE_LANGUAGE}
                      disabled={formDisabled || readOnly}
                      label={t(`labelNativeLanguage`)}
                      placeholder={
                        readOnly ? '' : t(`placeholderNativeLanguage`)
                      }
                      readOnly={readOnly}
                      required
                    />
                    <LanguageField
                      name={ENROLMENT_FIELDS.SERVICE_LANGUAGE}
                      disabled={formDisabled || readOnly}
                      label={t(`labelServiceLanguage`)}
                      placeholder={
                        readOnly ? '' : t(`placeholderServiceLanguage`)
                      }
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
                    placeholder={readOnly ? '' : t(`placeholderExtraInfo`)}
                    readOnly={readOnly}
                  />
                </FormGroup>
              </Fieldset>
              {!readOnly && (
                <>
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
                </>
              )}
              {readOnly && (
                <div className={styles.buttonWrapper}>
                  <Button
                    className={styles.button}
                    disabled={formDisabled}
                    iconLeft={<IconCross aria-hidden={true} />}
                    onClick={() => setOpenModal(ENROLMENT_MODALS.CANCEL)}
                    variant={'danger'}
                  >
                    {t('buttonCancel')}
                  </Button>
                </div>
              )}
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

export default EnrolmentForm;
