import {
  LocalisedObject,
  Meta,
  numberOrNull,
  stringOrNull,
} from '../api/types';

export type Registration = {
  id: string;
  audience_max_age: numberOrNull;
  audience_min_age: numberOrNull;
  confirmation_message: string;
  created_at: stringOrNull;
  created_by: stringOrNull;
  current_attendee_count: number;
  current_waiting_attendee_count: number;
  enrolment_end_time: string;
  enrolment_start_time: string;
  event_id: string;
  instructions: stringOrNull;
  last_modified_time: stringOrNull;
  maximum_attendee_capacity: numberOrNull;
  minimum_attendee_capacity: numberOrNull;
  name: LocalisedObject;
  updated_at: stringOrNull;
  waiting_attendee_capacity: numberOrNull;
  '@id': string;
  '@context': string;
  '@type': string;
};

export type RegistrationsResponse = {
  data: Registration[];
  meta: Meta;
};
