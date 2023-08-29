import { stringOrNull } from '../api/types';
import { Signup, SignupInput } from '../enrolment/types';

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
