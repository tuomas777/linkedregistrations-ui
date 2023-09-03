/* eslint-disable max-len */
import { Field, Form, Formik } from 'formik';
import { IconCross } from 'hds-react';
import pick from 'lodash/pick';
import { useTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';
import { ValidationError } from 'yup';
import 'react-toastify/dist/ReactToastify.css';

import Button from '../../../common/components/button/Button';
import Fieldset from '../../../common/components/fieldset/Fieldset';
import CheckboxField from '../../../common/components/formFields/CheckboxField';
import CheckboxGroupField from '../../../common/components/formFields/CheckboxGroupField';
import PhoneInputField from '../../../common/components/formFields/PhoneInputField';
import SingleSelectField from '../../../common/components/formFields/SingleSelectField';
import TextAreaField from '../../../common/components/formFields/TextAreaField';
import TextInputField from '../../../common/components/formFields/TextInputField';
import FormGroup from '../../../common/components/formGroup/FormGroup';
import FormikPersist from '../../../common/components/formikPersist/FormikPersist';
import ServerErrorSummary from '../../../common/components/serverErrorSummary/ServerErrorSummary';
import { FORM_NAMES } from '../../../constants';
import useLocale from '../../../hooks/useLocale';
import { ROUTES } from '../../app/routes/constants';
import ButtonWrapper from '../../enrolment/buttonWrapper/ButtonWrapper';
import {
  ENROLMENT_QUERY_PARAMS,
  NOTIFICATIONS,
  SIGNUP_GROUP_FIELDS,
} from '../../enrolment/constants';
import Divider from '../../enrolment/divider/Divider';
import { useEnrolmentPageContext } from '../../enrolment/enrolmentPageContext/hooks/useEnrolmentPageContext';
import { useEnrolmentServerErrorsContext } from '../../enrolment/enrolmentServerErrorsContext/hooks/useEnrolmentServerErrorsContext';
import useLanguageOptions from '../../enrolment/hooks/useLanguageOptions';
import useNotificationOptions from '../../enrolment/hooks/useNotificationOptions';
import ParticipantAmountSelector from '../../enrolment/participantAmountSelector/ParticipantAmountSelector';
import ReservationTimer from '../../enrolment/reservationTimer/ReservationTimer';
import { SignupFields, SignupGroupFormFields } from '../../enrolment/types';
import { Registration } from '../../registration/types';
import { isRegistrationPossible } from '../../registration/utils';
import {
  getSeatsReservationData,
  isSeatsReservationExpired,
} from '../../reserveSeats/utils';
import { SIGNUP_MODALS } from '../../signup/constants';
import useSignupActions from '../../signup/hooks/useSignupActions';
import ConfirmDeleteSignupModal from '../../signup/modals/confirmDeleteSignupModal/ConfirmDeleteSignupModal';
import { Signup } from '../../signup/types';
import { isSignupFieldRequired } from '../utils';
import {
  getSignupGroupSchema,
  scrollToFirstError,
  showErrors,
} from '../validation';
import AvailableSeatsText from './availableSeatsText/AvailableSeatsText';
import styles from './signupGroupForm.module.scss';
import Signups from './signups/Signups';

const RegistrationWarning = dynamic(
  () => import('../../enrolment/registrationWarning/RegistrationWarning'),
  { ssr: false }
);

type Props = {
  initialValues: SignupGroupFormFields;
  readOnly?: boolean;
  registration: Registration;
  signup?: Signup;
};

const SignupGroupForm: React.FC<Props> = ({
  initialValues,
  readOnly,
  registration,
  signup,
}) => {
  const { t } = useTranslation(['enrolment', 'common']);
  const { deleteSignup } = useSignupActions({ registration, signup });
  const formSavingDisabled = React.useRef(!!readOnly);

  const reservationTimerCallbacksDisabled = React.useRef(false);
  const disableReservationTimerCallbacks = React.useCallback(() => {
    reservationTimerCallbacksDisabled.current = true;
  }, []);

  const { closeModal, openModal, setOpenModal, setOpenParticipant } =
    useEnrolmentPageContext();

  const notificationOptions = useNotificationOptions();
  const languageOptions = useLanguageOptions();
  const serviceLanguageOptions = useLanguageOptions({ serviceLanguage: true });

  const locale = useLocale();
  const router = useRouter();
  const { query } = router;

  const formDisabled = useMemo(() => {
    const data = getSeatsReservationData(registration.id);
    if (data && !isSeatsReservationExpired(data)) {
      return false;
    }

    return !isRegistrationPossible(registration);
  }, [registration]);

  const { serverErrorItems, setServerErrorItems, showServerErrors } =
    useEnrolmentServerErrorsContext();

  const goToPage = (pathname: string) => {
    router.push({
      pathname,
      query: pick(query, [
        ENROLMENT_QUERY_PARAMS.IFRAME,
        ENROLMENT_QUERY_PARAMS.REDIRECT_URL,
      ]),
    });
  };
  const goToEnrolmentSummaryPage = () => {
    goToPage(
      `/${locale}${ROUTES.CREATE_SIGNUP_GROUP_SUMMARY.replace(
        '[registrationId]',
        registration.id
      )}`
    );
  };

  const goToSignupCancelledPage = () => {
    goToPage(
      `/${locale}${ROUTES.SIGNUP_CANCELLED.replace(
        '[registrationId]',
        registration.id
      )}`
    );
  };

  const handleDelete = async () => {
    setServerErrorItems([]);
    await deleteSignup({
      onError: (error) =>
        showServerErrors({ error: JSON.parse(error.message) }, 'enrolment'),
      onSuccess: goToSignupCancelledPage,
    });
  };

  const isRestoringDisabled = () => {
    const data = getSeatsReservationData(registration.id);
    return !readOnly && (!data || isSeatsReservationExpired(data));
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={/* istanbul ignore next */ () => undefined}
      validationSchema={
        readOnly ? undefined : () => getSignupGroupSchema(registration)
      }
    >
      {({ setErrors, setFieldValue, setTouched, values }) => {
        const clearErrors = () => setErrors({});

        const setSignups = (signups: SignupFields[]) => {
          setFieldValue(SIGNUP_GROUP_FIELDS.SIGNUPS, signups);
        };

        const handleSubmit = async () => {
          try {
            setServerErrorItems([]);
            clearErrors();

            await getSignupGroupSchema(registration).validate(values, {
              abortEarly: false,
            });

            goToEnrolmentSummaryPage();
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
            <ConfirmDeleteSignupModal
              isOpen={openModal === SIGNUP_MODALS.DELETE}
              onCancel={handleDelete}
              onClose={closeModal}
            />
            <Form noValidate>
              <FormikPersist
                isSessionStorage={true}
                name={`${FORM_NAMES.CREATE_SIGNUP_GROUP_FORM}-${registration.id}`}
                restoringDisabled={isRestoringDisabled()}
                savingDisabled={formSavingDisabled.current}
              />

              <ServerErrorSummary errors={serverErrorItems} />
              <RegistrationWarning registration={registration} />

              {isRegistrationPossible(registration) && !readOnly && (
                <>
                  <Divider />
                  <ReservationTimer
                    callbacksDisabled={
                      reservationTimerCallbacksDisabled.current
                    }
                    disableCallbacks={disableReservationTimerCallbacks}
                    initReservationData={true}
                    registration={registration}
                    setSignups={setSignups}
                    signups={values.signups}
                  />
                </>
              )}

              <Divider />
              <h2>{t('titleRegistration')}</h2>

              <AvailableSeatsText registration={registration} />
              <ParticipantAmountSelector
                disabled={formDisabled || !!readOnly}
                registration={registration}
              />

              <Signups
                formDisabled={formDisabled}
                readOnly={readOnly}
                registration={registration}
              />

              <h2 className={styles.sectionTitle}>{t('titleInformantInfo')}</h2>
              <Divider />

              <Fieldset heading={t(`titleContactInfo`)}>
                <FormGroup>
                  <div className={styles.emailRow}>
                    <Field
                      name={SIGNUP_GROUP_FIELDS.EMAIL}
                      component={TextInputField}
                      disabled={formDisabled}
                      label={t(`labelEmail`)}
                      placeholder={readOnly ? '' : t(`placeholderEmail`)}
                      readOnly={readOnly}
                      required
                    />
                    <Field
                      name={SIGNUP_GROUP_FIELDS.PHONE_NUMBER}
                      component={PhoneInputField}
                      disabled={formDisabled}
                      label={t(`labelPhoneNumber`)}
                      placeholder={readOnly ? '' : t(`placeholderPhoneNumber`)}
                      readOnly={readOnly}
                      required={
                        values.notifications.includes(NOTIFICATIONS.SMS) ||
                        isSignupFieldRequired(
                          registration,
                          SIGNUP_GROUP_FIELDS.PHONE_NUMBER
                        )
                      }
                      type="tel"
                    />
                  </div>
                </FormGroup>
              </Fieldset>

              <Fieldset heading={t(`titleNotifications`)}>
                <FormGroup>
                  <Field
                    name={SIGNUP_GROUP_FIELDS.NOTIFICATIONS}
                    className={styles.notifications}
                    component={CheckboxGroupField}
                    // TODO: At the moment only email notifications are supported
                    disabled={true}
                    // disabled={formDisabled || readOnly}
                    label={t(`titleNotifications`)}
                    options={notificationOptions}
                    required
                  />
                </FormGroup>
              </Fieldset>

              <Fieldset heading={t(`titleAdditionalInfo`)}>
                <FormGroup>
                  <div className={styles.membershipNumberRow}>
                    <Field
                      name={SIGNUP_GROUP_FIELDS.MEMBERSHIP_NUMBER}
                      component={TextInputField}
                      disabled={formDisabled}
                      label={t(`labelMembershipNumber`)}
                      placeholder={
                        readOnly ? '' : t(`placeholderMembershipNumber`)
                      }
                      readOnly={readOnly}
                      required={isSignupFieldRequired(
                        registration,
                        SIGNUP_GROUP_FIELDS.MEMBERSHIP_NUMBER
                      )}
                    />
                  </div>
                </FormGroup>
                <FormGroup>
                  <div className={styles.nativeLanguageRow}>
                    <Field
                      component={SingleSelectField}
                      name={SIGNUP_GROUP_FIELDS.NATIVE_LANGUAGE}
                      disabled={formDisabled || readOnly}
                      label={t(`labelNativeLanguage`)}
                      options={languageOptions}
                      placeholder={
                        readOnly ? '' : t(`placeholderNativeLanguage`)
                      }
                      readOnly={readOnly}
                      required
                    />
                    <Field
                      component={SingleSelectField}
                      name={SIGNUP_GROUP_FIELDS.SERVICE_LANGUAGE}
                      disabled={formDisabled || readOnly}
                      label={t(`labelServiceLanguage`)}
                      options={serviceLanguageOptions}
                      placeholder={
                        readOnly ? '' : t(`placeholderServiceLanguage`)
                      }
                      required
                    />
                  </div>
                </FormGroup>
                <FormGroup>
                  <Field
                    name={SIGNUP_GROUP_FIELDS.EXTRA_INFO}
                    component={TextAreaField}
                    disabled={formDisabled}
                    label={t(`labelExtraInfo`)}
                    placeholder={readOnly ? '' : t(`placeholderExtraInfo`)}
                    readOnly={readOnly}
                    required={isSignupFieldRequired(
                      registration,
                      SIGNUP_GROUP_FIELDS.EXTRA_INFO
                    )}
                  />
                </FormGroup>
              </Fieldset>
              {!readOnly && (
                <>
                  <FormGroup>
                    <Field
                      disabled={formDisabled}
                      label={
                        <span
                          dangerouslySetInnerHTML={{
                            __html: t('labelAccepted', {
                              openInNewTab: t('common:openInNewTab'),
                              url: t('linkDataProtectionNotice'),
                            }),
                          }}
                        />
                      }
                      name={SIGNUP_GROUP_FIELDS.ACCEPTED}
                      component={CheckboxField}
                    />
                  </FormGroup>

                  <ButtonWrapper>
                    <Button disabled={formDisabled} onClick={handleSubmit}>
                      {t('buttonGoToSummary')}
                    </Button>
                  </ButtonWrapper>
                </>
              )}
              {readOnly && (
                <ButtonWrapper>
                  <Button
                    disabled={formDisabled}
                    iconLeft={<IconCross aria-hidden={true} />}
                    onClick={() => setOpenModal(SIGNUP_MODALS.DELETE)}
                    variant={'danger'}
                  >
                    {t('buttonCancel')}
                  </Button>
                </ButtonWrapper>
              )}
            </Form>
          </>
        );
      }}
    </Formik>
  );
};

export default SignupGroupForm;
