import endOfDay from 'date-fns/endOfDay';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import startOfDay from 'date-fns/startOfDay';
import subYears from 'date-fns/subYears';
import { FormikErrors, FormikTouched } from 'formik';
import set from 'lodash/set';
import { scroller } from 'react-scroll';
import * as Yup from 'yup';

import { VALIDATION_MESSAGE_KEYS } from '../../constants';
import isValidDate from '../../utils/isValidDate';
import stringToDate from '../../utils/stringToDate';
import {
  createMinErrorMessage,
  isValidPhoneNumber,
  isValidZip,
} from '../../utils/validationUtils';
import wait from '../../utils/wait';
import { numberOrNull, stringOrNull } from '../api/types';
import {
  NOTIFICATIONS,
  SIGNUP_FIELDS,
  SIGNUP_GROUP_FIELDS,
  SIGNUP_GROUP_FORM_SELECT_FIELDS,
} from '../enrolment/constants';
import { SignupGroupFormFields } from '../enrolment/types';
import { Registration } from '../registration/types';
import { isDateOfBirthFieldRequired, isSignupFieldRequired } from './utils';

export const isAboveMinAge = (
  dateStr: stringOrNull | undefined,
  minAge: numberOrNull
): boolean =>
  minAge && dateStr && isValidDate(dateStr)
    ? isBefore(stringToDate(dateStr), subYears(endOfDay(new Date()), minAge))
    : true;

export const isBelowMaxAge = (
  dateStr: stringOrNull | undefined,
  maxAge: numberOrNull
): boolean =>
  maxAge && dateStr && isValidDate(dateStr)
    ? isAfter(
        stringToDate(dateStr),
        subYears(startOfDay(new Date()), maxAge + 1)
      )
    : true;

const getStringSchema = (required: boolean) =>
  required
    ? Yup.string().required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
    : Yup.string();

export const getSignupSchema = (registration: Registration) => {
  const { audience_max_age, audience_min_age } = registration;

  return Yup.object().shape({
    [SIGNUP_FIELDS.FIRST_NAME]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.FIRST_NAME)
    ),
    [SIGNUP_FIELDS.LAST_NAME]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.LAST_NAME)
    ),
    [SIGNUP_FIELDS.STREET_ADDRESS]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.STREET_ADDRESS)
    ),
    [SIGNUP_FIELDS.DATE_OF_BIRTH]: getStringSchema(
      isDateOfBirthFieldRequired(registration)
    )
      .test(
        'isValidDate',
        VALIDATION_MESSAGE_KEYS.DATE,
        (date) => !date || isValidDate(date)
      )
      .test(
        'isAboveMinAge',
        () => ({
          key: VALIDATION_MESSAGE_KEYS.AGE_MIN,
          min: audience_min_age,
        }),
        (date) => isAboveMinAge(date, audience_min_age)
      )
      .test(
        'isBelowMaxAge',
        () => ({
          key: VALIDATION_MESSAGE_KEYS.AGE_MAX,
          max: audience_max_age,
        }),
        (date) => isBelowMaxAge(date, audience_max_age)
      ),
    [SIGNUP_FIELDS.ZIPCODE]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.ZIPCODE)
    ).test(
      'isValidZip',
      VALIDATION_MESSAGE_KEYS.ZIP,
      (value) => !value || isValidZip(value)
    ),
    [SIGNUP_FIELDS.CITY]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.CITY)
    ),
    [SIGNUP_FIELDS.EXTRA_INFO]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_FIELDS.EXTRA_INFO)
    ),
  });
};

export const getSignupGroupSchema = (registration: Registration) => {
  return Yup.object().shape({
    [SIGNUP_GROUP_FIELDS.SIGNUPS]: Yup.array().of(
      getSignupSchema(registration)
    ),
    [SIGNUP_GROUP_FIELDS.EMAIL]: Yup.string()
      .email(VALIDATION_MESSAGE_KEYS.EMAIL)
      .required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED),
    [SIGNUP_GROUP_FIELDS.PHONE_NUMBER]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_GROUP_FIELDS.PHONE_NUMBER)
    )
      .test(
        'isValidPhoneNumber',
        VALIDATION_MESSAGE_KEYS.PHONE,
        (value) => !value || isValidPhoneNumber(value)
      )
      .when(
        [SIGNUP_GROUP_FIELDS.NOTIFICATIONS],
        (notifications: string[], schema) =>
          notifications.includes(NOTIFICATIONS.SMS)
            ? schema.required(VALIDATION_MESSAGE_KEYS.STRING_REQUIRED)
            : schema
      ),
    [SIGNUP_GROUP_FIELDS.MEMBERSHIP_NUMBER]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_GROUP_FIELDS.MEMBERSHIP_NUMBER)
    ),
    [SIGNUP_GROUP_FIELDS.NOTIFICATIONS]: Yup.array()
      .required(VALIDATION_MESSAGE_KEYS.ARRAY_REQUIRED)
      .min(1, (param) =>
        createMinErrorMessage(param, VALIDATION_MESSAGE_KEYS.ARRAY_MIN)
      ),
    [SIGNUP_GROUP_FIELDS.NATIVE_LANGUAGE]: Yup.string().required(
      VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
    ),
    [SIGNUP_GROUP_FIELDS.SERVICE_LANGUAGE]: Yup.string().required(
      VALIDATION_MESSAGE_KEYS.STRING_REQUIRED
    ),
    [SIGNUP_GROUP_FIELDS.EXTRA_INFO]: getStringSchema(
      isSignupFieldRequired(registration, SIGNUP_GROUP_FIELDS.EXTRA_INFO)
    ),
    [SIGNUP_GROUP_FIELDS.ACCEPTED]: Yup.bool().oneOf(
      [true],
      VALIDATION_MESSAGE_KEYS.SIGNUP_ACCEPTED
    ),
  });
};

// This functions sets formik errors and touched values correctly after validation.
// The reason for this is to show all errors after validating the form.
// Errors are shown only for touched fields so set all fields with error touched
export const showErrors = ({
  error,
  setErrors,
  setTouched,
}: {
  error: Yup.ValidationError;
  setErrors: (errors: FormikErrors<SignupGroupFormFields>) => void;
  setTouched: (
    touched: FormikTouched<SignupGroupFormFields>,
    shouldValidate?: boolean
  ) => void;
}): void => {
  /* istanbul ignore else */
  if (error.name === 'ValidationError') {
    const newErrors = error.inner.reduce(
      (acc, e: Yup.ValidationError) =>
        set(acc, e.path ?? /* istanbul ignore next */ '', e.errors[0]),
      {}
    );
    const touchedFields = error.inner.reduce(
      (acc, e: Yup.ValidationError) =>
        set(acc, e.path ?? /* istanbul ignore next */ '', true),
      {}
    );

    setErrors(newErrors);
    setTouched(touchedFields);
  }
};

const getFocusableFieldId = (
  fieldName: string
): {
  fieldId: string;
  fieldType: 'default' | 'checkboxGroup' | 'select';
} => {
  // For the select elements, focus the toggle button
  if (SIGNUP_GROUP_FORM_SELECT_FIELDS.find((item) => item === fieldName)) {
    return { fieldId: `${fieldName}-toggle-button`, fieldType: 'select' };
  } else if (fieldName === SIGNUP_GROUP_FIELDS.NOTIFICATIONS) {
    return { fieldId: fieldName, fieldType: 'checkboxGroup' };
  }
  return { fieldId: fieldName, fieldType: 'default' };
};

export const scrollToFirstError = async ({
  error,
  setOpenAccordion,
}: {
  error: Yup.ValidationError;
  setOpenAccordion: (index: number) => void;
}): Promise<void> => {
  for (const e of error.inner) {
    const path = e.path ?? /* istanbul ignore next */ '';

    if (/^signups\[\d*\]\./.test(path)) {
      const signupIndex = Number(path.match(/(?<=\[)[[\d]{1,4}(?=\])/)?.[0]);
      setOpenAccordion(signupIndex);

      await wait(100);
    }

    const { fieldId, fieldType } = getFocusableFieldId(path);
    const field = document.getElementById(fieldId);

    /* istanbul ignore else */
    if (field) {
      scroller.scrollTo(fieldId, {
        delay: 0,
        duration: 500,
        offset: -200,
        smooth: true,
      });

      if (fieldType === 'checkboxGroup') {
        const focusable = field.querySelectorAll('input');

        /* istanbul ignore else */
        if (focusable?.[0]) {
          focusable[0].focus();
        }
      } else {
        field.focus();
      }

      break;
    }
  }
};
