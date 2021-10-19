import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';

import { fakeRegistrations } from '../../../utils/mockDataUtils';
import {
  TEST_EVENT_ID,
  TEST_EVENT_ID2,
  TEST_EVENT_ID3,
  TEST_EVENT_ID4,
  TEST_EVENT_ID5,
} from '../../event/constants';
import { Registration } from '../types';

const now = new Date();
const enrolment_start_time = subDays(now, 1).toISOString();
const enrolment_end_time = addDays(now, 1).toISOString();
const registrationOverrides = {
  enrolment_end_time,
  enrolment_start_time,
  maximum_attendee_capacity: 10,
  waiting_attendee_capacity: 10,
};

const registrationsOverrides: Partial<Registration>[] = [
  {
    id: '1',
    event_id: TEST_EVENT_ID,
    current_attendee_count: 0,
    ...registrationOverrides,
  },
  {
    id: '2',
    event_id: TEST_EVENT_ID2,
    current_attendee_count: registrationOverrides.maximum_attendee_capacity,
    current_waiting_attendee_count: 0,
    ...registrationOverrides,
  },
  {
    id: '3',
    event_id: TEST_EVENT_ID3,
    current_attendee_count: registrationOverrides.maximum_attendee_capacity,
    current_waiting_attendee_count: 0,
    ...registrationOverrides,
    waiting_attendee_capacity: null,
  },
  {
    id: '4',
    event_id: TEST_EVENT_ID4,
    current_attendee_count: registrationOverrides.maximum_attendee_capacity,
    current_waiting_attendee_count:
      registrationOverrides.waiting_attendee_capacity,
    ...registrationOverrides,
  },
  {
    id: '5',
    event_id: TEST_EVENT_ID5,
    ...registrationOverrides,
    current_attendee_count: 1000,
    maximum_attendee_capacity: 0,
  },
];

const registrationsResponse = fakeRegistrations(
  registrationsOverrides.length,
  registrationsOverrides
);

export { registrationsResponse };
