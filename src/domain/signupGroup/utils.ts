import { AxiosError } from 'axios';
import isEqual from 'lodash/isEqual';
import snakeCase from 'lodash/snakeCase';

import { FORM_NAMES } from '../../constants';
import { ExtendedSession } from '../../types';
import formatDate from '../../utils/formatDate';
import stringToDate from '../../utils/stringToDate';
import { callPost } from '../app/axios/axiosClient';
import { Registration } from '../registration/types';
import { SeatsReservation } from '../reserveSeats/types';
import { NOTIFICATION_TYPE } from '../signup/constants';
import { Signup, SignupInput } from '../signup/types';
import {
  NOTIFICATIONS,
  SIGNUP_FIELDS,
  SIGNUP_GROUP_FIELDS,
  SIGNUP_GROUP_INITIAL_VALUES,
  SIGNUP_INITIAL_VALUES,
} from './constants';
import {
  CreateSignupGroupMutationInput,
  CreateSignupGroupResponse,
  SignupFields,
  SignupGroupFormFields,
} from './types';

export const getSignupNotificationsCode = (
  notifications: string[]
): NOTIFICATION_TYPE => {
  if (
    notifications.includes(NOTIFICATIONS.EMAIL) &&
    notifications.includes(NOTIFICATIONS.SMS)
  ) {
    return NOTIFICATION_TYPE.SMS_EMAIL;
  } else if (notifications.includes(NOTIFICATIONS.EMAIL)) {
    return NOTIFICATION_TYPE.EMAIL;
  } else if (notifications.includes(NOTIFICATIONS.SMS)) {
    return NOTIFICATION_TYPE.SMS;
  } else {
    return NOTIFICATION_TYPE.NO_NOTIFICATION;
  }
};

export const getSignupNotificationTypes = (
  notifications: string
): NOTIFICATIONS[] => {
  switch (notifications) {
    case NOTIFICATION_TYPE.SMS:
      return [NOTIFICATIONS.SMS];
    case NOTIFICATION_TYPE.EMAIL:
      return [NOTIFICATIONS.EMAIL];
    case NOTIFICATION_TYPE.SMS_EMAIL:
      return [NOTIFICATIONS.EMAIL, NOTIFICATIONS.SMS];
    default:
      return [];
  }
};

export const createSignupGroup = async ({
  input,
  session,
}: {
  input: CreateSignupGroupMutationInput;
  session: ExtendedSession | null;
}): Promise<CreateSignupGroupResponse> => {
  try {
    const { data } = await callPost({
      data: JSON.stringify(input),
      session,
      url: `/signup_group/`,
    });
    return data;
  } catch (error) {
    throw Error(JSON.stringify((error as AxiosError).response?.data));
  }
};

export const getSignupGroupPayload = ({
  formValues,
  registration,
  reservationCode,
}: {
  formValues: SignupGroupFormFields;
  registration: Registration;
  reservationCode: string;
}): CreateSignupGroupMutationInput => {
  const {
    email,
    extraInfo: groupExtraInfo,
    membershipNumber,
    nativeLanguage,
    phoneNumber,
    serviceLanguage,
    signups: signupsValues,
  } = formValues;

  const signups: SignupInput[] = signupsValues.map((signup, index) => {
    const {
      city,
      dateOfBirth,
      extraInfo,
      firstName,
      lastName,
      streetAddress,
      zipcode,
    } = signup;
    return {
      city: city || '',
      date_of_birth: dateOfBirth
        ? formatDate(stringToDate(dateOfBirth), 'yyyy-MM-dd')
        : null,
      email: email || null,
      extra_info: extraInfo,
      first_name: firstName || '',
      last_name: lastName || '',
      membership_number: membershipNumber,
      native_language: nativeLanguage || null,
      // TODO: At the moment only email notifications are supported
      notifications: NOTIFICATION_TYPE.EMAIL,
      // notifications: getSignupNotificationsCode(notifications),
      phone_number: phoneNumber || null,
      responsible_for_group: index == 0,
      service_language: serviceLanguage || null,
      street_address: streetAddress || null,
      zipcode: zipcode || null,
    };
  });

  return {
    extra_info: groupExtraInfo,
    registration: registration.id,
    reservation_code: reservationCode,
    signups,
  };
};

export const getSignupDefaultInitialValues = (): SignupFields => ({
  ...SIGNUP_INITIAL_VALUES,
});

export const getSignupGroupDefaultInitialValues =
  (): SignupGroupFormFields => ({
    ...SIGNUP_GROUP_INITIAL_VALUES,
    signups: [getSignupDefaultInitialValues()],
  });

export const getSignupGroupInitialValues = (
  signup: Signup
): SignupGroupFormFields => {
  return {
    ...getSignupGroupDefaultInitialValues(),
    accepted: true,
    email: signup.email || '-',
    extraInfo: signup.extra_info || '-',
    membershipNumber: signup.membership_number || '-',
    nativeLanguage: signup.native_language ?? '',
    // TODO: At the moment only email notifications are supported
    notifications: [NOTIFICATIONS.EMAIL],
    // notifications: getSignupNotificationTypes(
    //   signup.notifications as string
    // ),
    phoneNumber: signup.phone_number || '-',
    serviceLanguage: signup.service_language ?? '',
    signups: [
      {
        city: signup.city || '-',
        dateOfBirth: signup.date_of_birth
          ? formatDate(new Date(signup.date_of_birth))
          : '',
        extraInfo: '',
        firstName: signup.first_name || '-',
        inWaitingList: false,
        lastName: signup.last_name || '-',
        streetAddress: signup.street_address || '-',
        zipcode: signup.zipcode || '-',
      },
    ],
  };
};

export const clearCreateSignupGroupFormData = (
  registrationId: string
): void => {
  sessionStorage?.removeItem(
    `${FORM_NAMES.CREATE_SIGNUP_GROUP_FORM}-${registrationId}`
  );
};

export const getNewSignups = ({
  seatsReservation,
  signups,
}: {
  seatsReservation: SeatsReservation;
  signups: SignupFields[];
}) => {
  const { in_waitlist, seats } = seatsReservation;
  const signupInitialValues = getSignupDefaultInitialValues();
  const filledSignups = signups.filter((a) => !isEqual(a, signupInitialValues));
  return [
    ...filledSignups,
    ...Array(Math.max(seats - filledSignups.length, 0)).fill(
      signupInitialValues
    ),
  ]
    .slice(0, seats)
    .map((signup) => ({ ...signup, inWaitingList: in_waitlist }));
};

export const isSignupFieldRequired = (
  registration: Registration,
  fieldId: SIGNUP_FIELDS | SIGNUP_GROUP_FIELDS
): boolean => registration.mandatory_fields.includes(snakeCase(fieldId));

export const isDateOfBirthFieldRequired = (
  registration: Registration
): boolean =>
  Boolean(registration.audience_max_age || registration.audience_min_age);
