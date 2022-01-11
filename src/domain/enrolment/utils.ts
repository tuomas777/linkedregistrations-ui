import { AxiosError } from 'axios';

import formatDate from '../../utils/formatDate';
import stringToDate from '../../utils/stringToDate';
import axiosClient from '../app/axios/axiosClient';
import { Registration } from '../registration/types';
import {
  ENROLMENT_INITIAL_VALUES,
  NOTIFICATIONS,
  NOTIFICATION_TYPE,
} from './constants';
import {
  CreateEnrolmentMutationInput,
  Enrolment,
  EnrolmentFormFields,
} from './types';

export const createEnrolment = async (
  input: CreateEnrolmentMutationInput
): Promise<Enrolment> => {
  try {
    const { data } = await axiosClient.post('/signup/', JSON.stringify(input));
    return data;
  } catch (error) {
    throw Error(JSON.stringify((error as AxiosError).response?.data));
  }
};

export const deleteEnrolment = async (
  cancellationCode: string
): Promise<null> => {
  try {
    const { data } = await axiosClient.delete('/signup/', {
      data: JSON.stringify({ cancellation_code: cancellationCode }),
    });
    return data;
  } catch (error) {
    throw Error(JSON.stringify((error as AxiosError).response?.data));
  }
};

export const getEnrolmentNotificationsCode = (
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

export const getEnrolmentNotificationTypes = (
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

export const getEnrolmentPayload = (
  formValues: EnrolmentFormFields,
  registration: Registration
): CreateEnrolmentMutationInput => {
  const {
    city,
    dateOfBirth,
    email,
    extraInfo,
    membershipNumber,
    name,
    nativeLanguage,
    notifications,
    phoneNumber,
    serviceLanguage,
    streetAddress,
    zip,
  } = formValues;

  return {
    city: city || null,
    date_of_birth: dateOfBirth
      ? formatDate(stringToDate(dateOfBirth), 'yyyy-MM-dd')
      : null,
    email: email || null,
    extra_info: extraInfo,
    membership_number: membershipNumber,
    name: name || null,
    native_language: nativeLanguage || null,
    notifications: getEnrolmentNotificationsCode(notifications),
    phone_number: phoneNumber || null,
    registration: registration.id as string,
    service_language: serviceLanguage || null,
    street_address: streetAddress || null,
    zipcode: zip || null,
  };
};

export const getEnrolmentDefaultInitialValues = (
  registration: Registration
): EnrolmentFormFields => ({
  ...ENROLMENT_INITIAL_VALUES,
  audienceMaxAge: registration.audience_max_age ?? null,
  audienceMinAge: registration.audience_min_age ?? null,
});

export const getEnrolmentInitialValues = (
  enrolment: Enrolment,
  registration: Registration
): EnrolmentFormFields => {
  return {
    ...getEnrolmentDefaultInitialValues(registration),
    accepted: true,
    city: enrolment.city ?? '-',
    dateOfBirth: enrolment.date_of_birth
      ? formatDate(new Date(enrolment.date_of_birth))
      : '',
    email: enrolment.email ?? '-',
    extraInfo: enrolment.extra_info ?? '-',
    membershipNumber: enrolment.membership_number ?? '-',
    name: enrolment.name ?? '-',
    nativeLanguage: enrolment.native_language ?? '',
    notifications: getEnrolmentNotificationTypes(
      enrolment.notifications as string
    ),
    phoneNumber: enrolment.phone_number ?? '-',
    serviceLanguage: enrolment.service_language ?? '',
    streetAddress: enrolment.street_address ?? '-',
    zip: enrolment.zipcode ?? '-',
  };
};
