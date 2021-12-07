import { stringOrNull } from '../api/types';
import {
  ATTENDEE_STATUS,
  ENROLMENT_FIELDS,
  NOTIFICATION_TYPE,
} from './constants';

export type EnrolmentFormFields = {
  [ENROLMENT_FIELDS.ACCEPTED]: boolean;
  [ENROLMENT_FIELDS.AUDIENCE_MAX_AGE]: number | null;
  [ENROLMENT_FIELDS.AUDIENCE_MIN_AGE]: number | null;
  [ENROLMENT_FIELDS.CITY]: string;
  [ENROLMENT_FIELDS.DATE_OF_BIRTH]: string;
  [ENROLMENT_FIELDS.EMAIL]: string;
  [ENROLMENT_FIELDS.EXTRA_INFO]: string;
  [ENROLMENT_FIELDS.MEMBERSHIP_NUMBER]: string;
  [ENROLMENT_FIELDS.NAME]: string;
  [ENROLMENT_FIELDS.NATIVE_LANGUAGE]: string;
  [ENROLMENT_FIELDS.NOTIFICATIONS]: string[];
  [ENROLMENT_FIELDS.PHONE_NUMBER]: string;
  [ENROLMENT_FIELDS.SERVICE_LANGUAGE]: string;
  [ENROLMENT_FIELDS.STREET_ADDRESS]: string;
  [ENROLMENT_FIELDS.ZIP]: string;
};

export type CreateEnrolmentMutationInput = {
  city?: stringOrNull;
  date_of_birth?: stringOrNull;
  email?: stringOrNull;
  extra_info?: stringOrNull;
  membership_number?: stringOrNull;
  name?: stringOrNull;
  native_language?: stringOrNull;
  notifications?: NOTIFICATION_TYPE;
  phone_number?: stringOrNull;
  registration: string;
  service_language?: stringOrNull;
  street_address?: stringOrNull;
  zipcode?: stringOrNull;
};

export type Enrolment = {
  id: string;
  attendee_status?: ATTENDEE_STATUS;
  cancellation_code?: string;
  city?: stringOrNull;
  date_of_birth?: stringOrNull;
  email?: stringOrNull;
  extra_info?: stringOrNull;
  membership_number?: stringOrNull;
  name?: stringOrNull;
  native_language?: stringOrNull;
  notifications?: NOTIFICATION_TYPE;
  phone_number?: stringOrNull;
  registration: string;
  service_language?: stringOrNull;
  street_address?: stringOrNull;
  zipcode?: stringOrNull;
};
