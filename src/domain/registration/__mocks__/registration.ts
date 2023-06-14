import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';

import { fakeRegistration } from '../../../utils/mockDataUtils';
import { event } from '../../event/__mocks__/event';
import {
  REGISTRATION_MANDATORY_FIELDS,
  TEST_REGISTRATION_ID,
} from '../constants';

const now = new Date();
const enrolment_start_time = subDays(now, 1).toISOString();
const enrolment_end_time = addDays(now, 1).toISOString();
const registrationOverrides = {
  enrolment_end_time,
  enrolment_start_time,
  maximum_attendee_capacity: 10,
  remaining_attendee_capacity: 10,
  remaining_waiting_list_capacity: 10,
  waiting_list_capacity: 10,
};

const registration = fakeRegistration({
  ...registrationOverrides,
  id: TEST_REGISTRATION_ID,
  event,
  audience_max_age: 18,
  audience_min_age: 8,
  mandatory_fields: [REGISTRATION_MANDATORY_FIELDS.NAME],
});

export { registration };
