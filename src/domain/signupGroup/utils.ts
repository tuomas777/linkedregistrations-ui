import { AxiosError } from 'axios';

import { ExtendedSession } from '../../types';
import formatDate from '../../utils/formatDate';
import stringToDate from '../../utils/stringToDate';
import { callPost } from '../app/axios/axiosClient';
import { NOTIFICATIONS, NOTIFICATION_TYPE } from '../enrolment/constants';
import { EnrolmentFormFields, SignupInput } from '../enrolment/types';
import { Registration } from '../registration/types';
import {
  CreateSignupGroupMutationInput,
  CreateSignupGroupResponse,
} from './types';

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
  formValues: EnrolmentFormFields;
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
      // notifications: getSignupNotificationTypes(notifications),
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
