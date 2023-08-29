import { stringOrNull } from '../api/types';
import {
  ATTENDEE_STATUS,
  NOTIFICATION_TYPE,
  SIGNUP_FIELDS,
  SIGNUP_GROUP_FIELDS,
} from './constants';

export type SignupFields = {
  [SIGNUP_FIELDS.CITY]: string;
  [SIGNUP_FIELDS.DATE_OF_BIRTH]: string;
  [SIGNUP_FIELDS.EXTRA_INFO]: string;
  [SIGNUP_FIELDS.FIRST_NAME]: string;
  [SIGNUP_FIELDS.IN_WAITING_LIST]: boolean;
  [SIGNUP_FIELDS.LAST_NAME]: string;
  [SIGNUP_FIELDS.STREET_ADDRESS]: string;
  [SIGNUP_FIELDS.ZIPCODE]: string;
};

export type SignupGroupFormFields = {
  [SIGNUP_GROUP_FIELDS.ACCEPTED]: boolean;
  [SIGNUP_GROUP_FIELDS.EMAIL]: string;
  [SIGNUP_GROUP_FIELDS.EXTRA_INFO]: string;
  [SIGNUP_GROUP_FIELDS.MEMBERSHIP_NUMBER]: string;
  [SIGNUP_GROUP_FIELDS.NATIVE_LANGUAGE]: string;
  [SIGNUP_GROUP_FIELDS.NOTIFICATIONS]: string[];
  [SIGNUP_GROUP_FIELDS.PHONE_NUMBER]: string;
  [SIGNUP_GROUP_FIELDS.SERVICE_LANGUAGE]: string;
  [SIGNUP_GROUP_FIELDS.SIGNUPS]: SignupFields[];
};

export type SignupInput = {
  city?: stringOrNull;
  date_of_birth?: stringOrNull;
  email?: stringOrNull;
  extra_info?: stringOrNull;
  first_name?: stringOrNull;
  last_name?: stringOrNull;
  membership_number?: stringOrNull;
  native_language?: stringOrNull;
  notifications?: NOTIFICATION_TYPE;
  phone_number?: stringOrNull;
  responsible_for_group: boolean;
  service_language?: stringOrNull;
  street_address?: stringOrNull;
  zipcode?: stringOrNull;
};

export type Signup = {
  id: string;
  attendee_status?: ATTENDEE_STATUS;
  city?: stringOrNull;
  created_at: stringOrNull;
  created_by: stringOrNull;
  date_of_birth?: stringOrNull;
  email?: stringOrNull;
  extra_info?: stringOrNull;
  first_name?: stringOrNull;
  last_modified_at: stringOrNull;
  last_modified_by: stringOrNull;
  last_name?: stringOrNull;
  membership_number?: stringOrNull;
  native_language?: stringOrNull;
  notifications?: NOTIFICATION_TYPE;
  phone_number?: stringOrNull;
  registration: string;
  responsible_for_group: boolean;
  service_language?: stringOrNull;
  street_address?: stringOrNull;
  zipcode?: stringOrNull;
};

export type DeleteEnrolmentMutationInput = {
  enrolmentId: string;
  registrationId: string;
};

export type EnrolmentQueryVariables = {
  enrolmentId: string;
};
