import { SignupFields, SignupGroupFormFields } from './types';

export enum SIGNUP_FIELDS {
  CITY = 'city',
  DATE_OF_BIRTH = 'dateOfBirth',
  EXTRA_INFO = 'extraInfo',
  FIRST_NAME = 'firstName',
  IN_WAITING_LIST = 'inWaitingList',
  LAST_NAME = 'lastName',
  STREET_ADDRESS = 'streetAddress',
  ZIPCODE = 'zipcode',
}

export enum SIGNUP_GROUP_FIELDS {
  ACCEPTED = 'accepted',
  EMAIL = 'email',
  EXTRA_INFO = 'extraInfo',
  MEMBERSHIP_NUMBER = 'membershipNumber',
  NATIVE_LANGUAGE = 'nativeLanguage',
  NOTIFICATIONS = 'notifications',
  PHONE_NUMBER = 'phoneNumber',
  SERVICE_LANGUAGE = 'serviceLanguage',
  SIGNUPS = 'signups',
}

export enum NOTIFICATIONS {
  EMAIL = 'email',
  SMS = 'sms',
}

export enum ENROLMENT_QUERY_PARAMS {
  IFRAME = 'iframe',
  REDIRECT_URL = 'redirect_url',
}

export const SIGNUP_INITIAL_VALUES: SignupFields = {
  [SIGNUP_FIELDS.CITY]: '',
  [SIGNUP_FIELDS.DATE_OF_BIRTH]: '',
  [SIGNUP_FIELDS.EXTRA_INFO]: '',
  [SIGNUP_FIELDS.FIRST_NAME]: '',
  [SIGNUP_FIELDS.IN_WAITING_LIST]: false,
  [SIGNUP_FIELDS.LAST_NAME]: '',
  [SIGNUP_FIELDS.STREET_ADDRESS]: '',
  [SIGNUP_FIELDS.ZIPCODE]: '',
};

export const SIGNUP_GROUP_INITIAL_VALUES: SignupGroupFormFields = {
  [SIGNUP_GROUP_FIELDS.ACCEPTED]: false,
  [SIGNUP_GROUP_FIELDS.EMAIL]: '',
  [SIGNUP_GROUP_FIELDS.EXTRA_INFO]: '',
  [SIGNUP_GROUP_FIELDS.MEMBERSHIP_NUMBER]: '',
  [SIGNUP_GROUP_FIELDS.NATIVE_LANGUAGE]: '',
  [SIGNUP_GROUP_FIELDS.NOTIFICATIONS]: [NOTIFICATIONS.EMAIL],
  [SIGNUP_GROUP_FIELDS.PHONE_NUMBER]: '',
  [SIGNUP_GROUP_FIELDS.SERVICE_LANGUAGE]: '',
  [SIGNUP_GROUP_FIELDS.SIGNUPS]: [],
};

export const SIGNUP_GROUP_FORM_SELECT_FIELDS = [
  SIGNUP_GROUP_FIELDS.NATIVE_LANGUAGE,
  SIGNUP_GROUP_FIELDS.SERVICE_LANGUAGE,
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
