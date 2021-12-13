import { EnrolmentFormFields } from './types';

export enum ENROLMENT_FIELDS {
  ACCEPTED = 'accepted',
  AUDIENCE_MAX_AGE = 'audienceMaxAge',
  AUDIENCE_MIN_AGE = 'audienceMinAge',
  CITY = 'city',
  DATE_OF_BIRTH = 'dateOfBirth',
  EMAIL = 'email',
  EXTRA_INFO = 'extraInfo',
  MEMBERSHIP_NUMBER = 'membershipNumber',
  NAME = 'name',
  NATIVE_LANGUAGE = 'nativeLanguage',
  NOTIFICATIONS = 'notifications',
  PHONE_NUMBER = 'phoneNumber',
  SERVICE_LANGUAGE = 'serviceLanguage',
  STREET_ADDRESS = 'streetAddress',
  ZIP = 'zip',
}

export enum NOTIFICATIONS {
  EMAIL = 'email',
  SMS = 'sms',
}

export const ENROLMENT_INITIAL_VALUES: EnrolmentFormFields = {
  [ENROLMENT_FIELDS.ACCEPTED]: false,
  [ENROLMENT_FIELDS.AUDIENCE_MAX_AGE]: null,
  [ENROLMENT_FIELDS.AUDIENCE_MIN_AGE]: null,
  [ENROLMENT_FIELDS.CITY]: '',
  [ENROLMENT_FIELDS.DATE_OF_BIRTH]: '',
  [ENROLMENT_FIELDS.EMAIL]: '',
  [ENROLMENT_FIELDS.EXTRA_INFO]: '',
  [ENROLMENT_FIELDS.MEMBERSHIP_NUMBER]: '',
  [ENROLMENT_FIELDS.NAME]: '',
  [ENROLMENT_FIELDS.NATIVE_LANGUAGE]: '',
  [ENROLMENT_FIELDS.NOTIFICATIONS]: [],
  [ENROLMENT_FIELDS.PHONE_NUMBER]: '',
  [ENROLMENT_FIELDS.SERVICE_LANGUAGE]: '',
  [ENROLMENT_FIELDS.STREET_ADDRESS]: '',
  [ENROLMENT_FIELDS.ZIP]: '',
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
