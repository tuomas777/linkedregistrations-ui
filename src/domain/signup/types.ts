import { Meta, stringOrNull } from '../api/types';

import {
  ATTENDEE_STATUS,
  NOTIFICATION_TYPE,
  PRESENCE_STATUS,
} from './constants';

export type SignupInput = {
  city?: stringOrNull;
  date_of_birth?: stringOrNull;
  email?: stringOrNull;
  extra_info?: stringOrNull;
  first_name?: stringOrNull;
  id?: stringOrNull;
  last_name?: stringOrNull;
  membership_number?: stringOrNull;
  native_language?: stringOrNull;
  notifications?: NOTIFICATION_TYPE;
  phone_number?: stringOrNull;
  presence_status?: PRESENCE_STATUS;
  responsible_for_group: boolean;
  service_language?: stringOrNull;
  street_address?: stringOrNull;
  user_consent: boolean;
  zipcode?: stringOrNull;
};

export type ContactPerson = {
  email?: stringOrNull;
  first_name?: stringOrNull;
  id: string;
  last_name?: stringOrNull;
  membership_number?: stringOrNull;
  native_language?: stringOrNull;
  notifications?: stringOrNull;
  phone_number?: stringOrNull;
  service_language?: stringOrNull;
};

export type Signup = {
  id: string;
  attendee_status?: ATTENDEE_STATUS;
  city?: stringOrNull;
  contact_person?: ContactPerson | null;
  created_by: stringOrNull;
  created_time: stringOrNull;
  date_of_birth?: stringOrNull;
  extra_info?: stringOrNull;
  first_name?: stringOrNull;
  is_created_by_current_user: boolean;
  last_modified_by: stringOrNull;
  last_modified_time: stringOrNull;
  last_name?: stringOrNull;
  presence_status?: PRESENCE_STATUS;
  registration: string;
  responsible_for_group: boolean;
  signup_group: stringOrNull;
  street_address?: stringOrNull;
  user_consent?: boolean;
  zipcode?: stringOrNull;
};

export type SignupsResponse = {
  data: Array<Signup>;
  meta: Meta;
};

export type DeleteSignupMutationInput = {
  registrationId: string;
  signupId: string;
};

export type UpdateSignupMutationInput = {
  id: string;
  registration: string;
} & SignupInput;

export type PatchSignupMutationInput = {
  id: string;
} & Partial<UpdateSignupMutationInput>;

export type SignupQueryVariables = {
  id: string;
};
