import {
  ContactPersonFormFields,
  SignupFormFields,
  SignupGroupFormFields,
} from './types';

export enum CONTACT_PERSON_FIELDS {
  EMAIL = 'email',
  FIRST_NAME = 'firstName',
  ID = 'id',
  LAST_NAME = 'lastName',
  MEMBERSHIP_NUMBER = 'membershipNumber',
  NATIVE_LANGUAGE = 'nativeLanguage',
  NOTIFICATIONS = 'notifications',
  PHONE_NUMBER = 'phoneNumber',
  SERVICE_LANGUAGE = 'serviceLanguage',
}

export enum SIGNUP_FIELDS {
  CITY = 'city',
  DATE_OF_BIRTH = 'dateOfBirth',
  EXTRA_INFO = 'extraInfo',
  FIRST_NAME = 'firstName',
  ID = 'id',
  IN_WAITING_LIST = 'inWaitingList',
  LAST_NAME = 'lastName',
  PHONE_NUMBER = 'phoneNumber',
  STREET_ADDRESS = 'streetAddress',
  ZIPCODE = 'zipcode',
}

export enum SIGNUP_GROUP_FIELDS {
  CONTACT_PERSON = 'contactPerson',
  EXTRA_INFO = 'extraInfo',
  SIGNUPS = 'signups',
  USER_CONSENT = 'userConsent',
}

export enum NOTIFICATIONS {
  EMAIL = 'email',
  SMS = 'sms',
}

export const CONTACT_PERSON_VALUES: ContactPersonFormFields = {
  [CONTACT_PERSON_FIELDS.EMAIL]: '',
  [CONTACT_PERSON_FIELDS.FIRST_NAME]: '',
  [CONTACT_PERSON_FIELDS.ID]: null,
  [CONTACT_PERSON_FIELDS.LAST_NAME]: '',
  [CONTACT_PERSON_FIELDS.MEMBERSHIP_NUMBER]: '',
  [CONTACT_PERSON_FIELDS.NATIVE_LANGUAGE]: '',
  [CONTACT_PERSON_FIELDS.NOTIFICATIONS]: [NOTIFICATIONS.EMAIL],
  [CONTACT_PERSON_FIELDS.PHONE_NUMBER]: '',
  [CONTACT_PERSON_FIELDS.SERVICE_LANGUAGE]: '',
};

export const SIGNUP_INITIAL_VALUES: SignupFormFields = {
  [SIGNUP_FIELDS.CITY]: '',
  [SIGNUP_FIELDS.DATE_OF_BIRTH]: '',
  [SIGNUP_FIELDS.EXTRA_INFO]: '',
  [SIGNUP_FIELDS.FIRST_NAME]: '',
  [SIGNUP_FIELDS.ID]: null,
  [SIGNUP_FIELDS.IN_WAITING_LIST]: false,
  [SIGNUP_FIELDS.LAST_NAME]: '',
  [SIGNUP_FIELDS.PHONE_NUMBER]: '',
  [SIGNUP_FIELDS.STREET_ADDRESS]: '',
  [SIGNUP_FIELDS.ZIPCODE]: '',
};

export const SIGNUP_GROUP_INITIAL_VALUES: SignupGroupFormFields = {
  [SIGNUP_GROUP_FIELDS.CONTACT_PERSON]: CONTACT_PERSON_VALUES,
  [SIGNUP_GROUP_FIELDS.EXTRA_INFO]: '',
  [SIGNUP_GROUP_FIELDS.SIGNUPS]: [],
  [SIGNUP_GROUP_FIELDS.USER_CONSENT]: false,
};

export const SIGNUP_GROUP_FORM_SELECT_FIELDS = [
  `${SIGNUP_GROUP_FIELDS.CONTACT_PERSON}.${CONTACT_PERSON_FIELDS.NATIVE_LANGUAGE}`,
  `${SIGNUP_GROUP_FIELDS.CONTACT_PERSON}.${CONTACT_PERSON_FIELDS.SERVICE_LANGUAGE}`,
];

export enum SIGNUP_GROUP_ACTIONS {
  CREATE = 'create',
  DELETE = 'delete',
  UPDATE = 'update',
}

export const TEST_SIGNUP_GROUP_ID = 'signupGroup:1';
