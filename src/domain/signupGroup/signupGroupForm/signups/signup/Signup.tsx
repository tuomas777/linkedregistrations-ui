import classNames from 'classnames';
import { Field } from 'formik';
import { Fieldset, IconTrash } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import Accordion from '../../../../../common/components/accordion/Accordion';
import DateInputField from '../../../../../common/components/formFields/DateInputField';
import TextAreaField from '../../../../../common/components/formFields/TextAreaField';
import TextInputField from '../../../../../common/components/formFields/TextInputField';
import FormGroup from '../../../../../common/components/formGroup/FormGroup';
import useLocale from '../../../../../hooks/useLocale';
import skipFalsyType from '../../../../../utils/skipFalsyType';
import { SIGNUP_FIELDS } from '../../../../enrolment/constants';
import { useEnrolmentPageContext } from '../../../../enrolment/enrolmentPageContext/hooks/useEnrolmentPageContext';
import InWaitingListInfo from '../../../../enrolment/inWaitingListInfo/InWaitingListInfo';
import { SignupFields } from '../../../../enrolment/types';
import { Registration } from '../../../../registration/types';
import {
  isDateOfBirthFieldRequired,
  isSignupFieldRequired,
} from '../../../utils';
import styles from './signup.module.scss';

type Props = {
  formDisabled: boolean;
  index: number;
  onDelete: () => void;
  readOnly?: boolean;
  registration: Registration;
  showDelete: boolean;
  signup: SignupFields;
  signupPath: string;
};

const getFieldName = (signupPath: string, field: string) =>
  `${signupPath}.${field}`;

const Signup: React.FC<Props> = ({
  formDisabled,
  index,
  onDelete,
  readOnly,
  registration,
  showDelete,
  signup,
  signupPath,
}) => {
  const { t } = useTranslation(['enrolment']);
  const locale = useLocale();
  const { openParticipant, toggleOpenParticipant } = useEnrolmentPageContext();

  return (
    <Accordion
      deleteButton={
        showDelete && !formDisabled ? (
          <button
            aria-label={t('buttonDeleteSignup') as string}
            className={styles.deleteButton}
            onClick={onDelete}
            type="button"
          >
            <IconTrash />
          </button>
        ) : undefined
      }
      onClick={() => toggleOpenParticipant(index)}
      open={openParticipant === index}
      toggleButtonIcon={
        signup.inWaitingList ? <InWaitingListInfo /> : undefined
      }
      toggleButtonLabel={
        [signup.firstName, signup.lastName].filter(skipFalsyType).join(' ') ||
        t('signupDefaultTitle', { index: index + 1 })
      }
    >
      <Fieldset heading={t(`titleBasicInfo`)}>
        <FormGroup>
          <div className={styles.nameRow}>
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.FIRST_NAME)}
              component={TextInputField}
              disabled={formDisabled}
              label={t(`labelFirstName`)}
              placeholder={readOnly ? '' : t(`placeholderFirstName`)}
              readOnly={readOnly}
              required={isSignupFieldRequired(
                registration,
                SIGNUP_FIELDS.FIRST_NAME
              )}
            />
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.LAST_NAME)}
              component={TextInputField}
              disabled={formDisabled}
              label={t(`labelLastName`)}
              placeholder={readOnly ? '' : t(`placeholderLastName`)}
              readOnly={readOnly}
              required={isSignupFieldRequired(
                registration,
                SIGNUP_FIELDS.LAST_NAME
              )}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div
            className={classNames(styles.streetAddressRow, {
              [styles.readOnly]: readOnly,
            })}
          >
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.STREET_ADDRESS)}
              component={TextInputField}
              disabled={formDisabled}
              label={t(`labelStreetAddress`)}
              placeholder={readOnly ? '' : t(`placeholderStreetAddress`)}
              readOnly={readOnly}
              required={isSignupFieldRequired(
                registration,
                SIGNUP_FIELDS.STREET_ADDRESS
              )}
            />
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.DATE_OF_BIRTH)}
              disabled={formDisabled}
              label={t(`labelDateOfBirth`)}
              language={locale}
              placeholder={readOnly ? '' : t(`placeholderDateOfBirth`)}
              readOnly={readOnly}
              required={isDateOfBirthFieldRequired(registration)}
              {...(readOnly
                ? { component: TextInputField }
                : {
                    component: DateInputField,
                    maxDate: new Date(),
                    minDate: new Date(
                      `${new Date().getFullYear() - 100}-01-01`
                    ),
                  })}
            />
          </div>
        </FormGroup>
        <FormGroup>
          <div
            className={classNames(styles.zipRow, {
              [styles.readOnly]: readOnly,
            })}
          >
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.ZIPCODE)}
              component={TextInputField}
              disabled={formDisabled}
              label={t(`labelZipcode`)}
              placeholder={readOnly ? '' : t(`placeholderZipcode`)}
              readOnly={readOnly}
              required={isSignupFieldRequired(
                registration,
                SIGNUP_FIELDS.ZIPCODE
              )}
            />
            <Field
              name={getFieldName(signupPath, SIGNUP_FIELDS.CITY)}
              component={TextInputField}
              disabled={formDisabled}
              label={t(`labelCity`)}
              placeholder={readOnly ? '' : t(`placeholderCity`)}
              readOnly={readOnly}
              required={isSignupFieldRequired(registration, SIGNUP_FIELDS.CITY)}
            />
          </div>
        </FormGroup>
        <Field
          name={getFieldName(signupPath, SIGNUP_FIELDS.EXTRA_INFO)}
          className={styles.extraInfoField}
          component={TextAreaField}
          disabled={formDisabled}
          label={t(`labelSignupExtraInfo`)}
          placeholder={readOnly ? '' : t(`placeholderSignupExtraInfo`)}
          readOnly={readOnly}
          required={isSignupFieldRequired(
            registration,
            SIGNUP_FIELDS.EXTRA_INFO
          )}
        />
      </Fieldset>
    </Accordion>
  );
};

export default Signup;
