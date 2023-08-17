import { AttendeeFields, EnrolmentFormFields } from './types';

export enum ATTENDEE_FIELDS {
  CITY = 'city',
  DATE_OF_BIRTH = 'dateOfBirth',
  EXTRA_INFO = 'extraInfo',
  FIRST_NAME = 'firstName',
  IN_WAITING_LIST = 'inWaitingList',
  LAST_NAME = 'lastName',
  STREET_ADDRESS = 'streetAddress',
  ZIPCODE = 'zipcode',
}

export enum ENROLMENT_FIELDS {
  ACCEPTED = 'accepted',
  ATTENDEES = 'attendees',
  EMAIL = 'email',
  EXTRA_INFO = 'extraInfo',
  MEMBERSHIP_NUMBER = 'membershipNumber',
  NATIVE_LANGUAGE = 'nativeLanguage',
  NOTIFICATIONS = 'notifications',
  PHONE_NUMBER = 'phoneNumber',
  SERVICE_LANGUAGE = 'serviceLanguage',
}

export enum NOTIFICATIONS {
  EMAIL = 'email',
  SMS = 'sms',
}

export enum ENROLMENT_QUERY_PARAMS {
  IFRAME = 'iframe',
  REDIRECT_URL = 'redirect_url',
}

export const ATTENDEE_INITIAL_VALUES: AttendeeFields = {
  [ATTENDEE_FIELDS.CITY]: '',
  [ATTENDEE_FIELDS.DATE_OF_BIRTH]: '',
  [ATTENDEE_FIELDS.EXTRA_INFO]: '',
  [ATTENDEE_FIELDS.FIRST_NAME]: '',
  [ATTENDEE_FIELDS.IN_WAITING_LIST]: false,
  [ATTENDEE_FIELDS.LAST_NAME]: '',
  [ATTENDEE_FIELDS.STREET_ADDRESS]: '',
  [ATTENDEE_FIELDS.ZIPCODE]: '',
};

export const ENROLMENT_INITIAL_VALUES: EnrolmentFormFields = {
  [ENROLMENT_FIELDS.ACCEPTED]: false,
  [ENROLMENT_FIELDS.ATTENDEES]: [],
  [ENROLMENT_FIELDS.EMAIL]: '',
  [ENROLMENT_FIELDS.EXTRA_INFO]: '',
  [ENROLMENT_FIELDS.MEMBERSHIP_NUMBER]: '',
  [ENROLMENT_FIELDS.NATIVE_LANGUAGE]: '',
  [ENROLMENT_FIELDS.NOTIFICATIONS]: [NOTIFICATIONS.EMAIL],
  [ENROLMENT_FIELDS.PHONE_NUMBER]: '',
  [ENROLMENT_FIELDS.SERVICE_LANGUAGE]: '',
};

export const ENROLMENT_FORM_SELECT_FIELDS = [
  ENROLMENT_FIELDS.NATIVE_LANGUAGE,
  ENROLMENT_FIELDS.SERVICE_LANGUAGE,
];

export enum ATTENDEE_STATUS {
  Attending = 'attending',
  Waitlisted = 'waitlisted',
}

export enum NOTIFICATION_TYPE {
  NO_NOTIFICATION = 'none',
  SMS = 'sms',
  EMAIL = 'email',
  SMS_EMAIL = 'sms and email',
}

export enum ENROLMENT_ACTIONS {
  CANCEL = 'cancel',
  CREATE = 'create',
}
export const TEST_ENROLMENT_ID = 'enrolment:1';

export const ENROLMENT_TIME_IN_MINUTES = 30;
export const ENROLMENT_TIME_PER_PARTICIPANT_IN_MINUTES = 1;

export enum ENROLMENT_MODALS {
  CANCEL = 'cancel',
  DELETE = 'delete',
  PERSONS_ADDED_TO_WAITLIST = 'personsAddedToWaitList',
  RESERVATION_TIME_EXPIRED = 'reservationTimeExpired',
}
