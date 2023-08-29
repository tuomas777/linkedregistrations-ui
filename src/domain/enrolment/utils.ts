import { AxiosError } from 'axios';
import isEqual from 'lodash/isEqual';
import snakeCase from 'lodash/snakeCase';

import { FORM_NAMES } from '../../constants';
import { ExtendedSession } from '../../types';
import formatDate from '../../utils/formatDate';
import { callDelete, callGet } from '../app/axios/axiosClient';
import { Registration } from '../registration/types';
import { SeatsReservation } from '../reserveSeats/types';
import {
  ATTENDEE_FIELDS,
  ATTENDEE_INITIAL_VALUES,
  ENROLMENT_FIELDS,
  ENROLMENT_INITIAL_VALUES,
  NOTIFICATIONS,
  NOTIFICATION_TYPE,
} from './constants';
import {
  AttendeeFields,
  EnrolmentFormFields,
  EnrolmentQueryVariables,
  Signup,
} from './types';

export const fetchEnrolment = async (
  args: EnrolmentQueryVariables,
  session: ExtendedSession | null
): Promise<Signup> => {
  try {
    const { data } = await callGet({
      session,
      url: enrolmentPathBuilder(args),
    });
    return data;
  } catch (error) {
    /* istanbul ignore next */
    throw Error(JSON.stringify((error as AxiosError).response?.data));
  }
};

export const enrolmentPathBuilder = (args: EnrolmentQueryVariables): string => {
  const { enrolmentId } = args;
  return `/signup/${enrolmentId}/`;
};

export const deleteEnrolment = async ({
  enrolmentId,
  session,
}: {
  enrolmentId: string;
  session: ExtendedSession | null;
}): Promise<null> => {
  try {
    const { data } = await callDelete({
      session,
      url: `/signup/${enrolmentId}/`,
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

export const getAttendeeDefaultInitialValues = (): AttendeeFields => ({
  ...ATTENDEE_INITIAL_VALUES,
});

export const getEnrolmentDefaultInitialValues = (): EnrolmentFormFields => ({
  ...ENROLMENT_INITIAL_VALUES,
  attendees: [getAttendeeDefaultInitialValues()],
});

export const getEnrolmentInitialValues = (
  enrolment: Signup
): EnrolmentFormFields => {
  return {
    ...getEnrolmentDefaultInitialValues(),
    accepted: true,
    attendees: [
      {
        city: enrolment.city || '-',
        dateOfBirth: enrolment.date_of_birth
          ? formatDate(new Date(enrolment.date_of_birth))
          : '',
        extraInfo: '',
        firstName: enrolment.first_name || '-',
        inWaitingList: false,
        lastName: enrolment.last_name || '-',
        streetAddress: enrolment.street_address || '-',
        zipcode: enrolment.zipcode || '-',
      },
    ],
    email: enrolment.email || '-',
    extraInfo: enrolment.extra_info || '-',
    membershipNumber: enrolment.membership_number || '-',
    nativeLanguage: enrolment.native_language ?? '',
    // TODO: At the moment only email notifications are supported
    notifications: [NOTIFICATIONS.EMAIL],
    // notifications: getEnrolmentNotificationTypes(
    //   enrolment.notifications as string
    // ),
    phoneNumber: enrolment.phone_number || '-',
    serviceLanguage: enrolment.service_language ?? '',
  };
};

export const clearCreateEnrolmentFormData = (registrationId: string): void => {
  sessionStorage?.removeItem(
    `${FORM_NAMES.CREATE_SIGNUP_GROUP_FORM}-${registrationId}`
  );
};

export const getNewAttendees = ({
  attendees,
  seatsReservation,
}: {
  attendees: AttendeeFields[];
  seatsReservation: SeatsReservation;
}) => {
  const { in_waitlist, seats } = seatsReservation;
  const attendeeInitialValues = getAttendeeDefaultInitialValues();
  const filledAttendees = attendees.filter(
    (a) => !isEqual(a, attendeeInitialValues)
  );
  return [
    ...filledAttendees,
    ...Array(Math.max(seats - filledAttendees.length, 0)).fill(
      attendeeInitialValues
    ),
  ]
    .slice(0, seats)
    .map((attendee) => ({ ...attendee, inWaitingList: in_waitlist }));
};

export const isEnrolmentFieldRequired = (
  registration: Registration,
  fieldId: ATTENDEE_FIELDS | ENROLMENT_FIELDS
): boolean => registration.mandatory_fields.includes(snakeCase(fieldId));

export const isDateOfBirthFieldRequired = (
  registration: Registration
): boolean =>
  Boolean(registration.audience_max_age || registration.audience_min_age);
