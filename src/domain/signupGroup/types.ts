import { stringOrNull } from '../api/types';
import { Signup, SignupInput } from '../signup/types';
import { SIGNUP_FIELDS, SIGNUP_GROUP_FIELDS } from './constants';

export type CreateSignupGroupMutationInput = {
  extra_info: string;
  registration: string;
  reservation_code: string;
  signups: SignupInput[];
};

export type CreateSignupGroupResponse = {
  extra_info: string;
  id: number;
  registration: string;
  signups: Signup[];
};

export type SignupGroup = {
  created_at: stringOrNull;
  created_by: stringOrNull;
  extra_info: string;
  id: number;
  last_modified_at: stringOrNull;
  last_modified_by: stringOrNull;
  registration: string;
  signups: Signup[];
};

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
