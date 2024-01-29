import subYears from 'date-fns/subYears';

import formatDate from '../../../utils/formatDate';
import { fakeContactPerson, fakeSignup } from '../../../utils/mockDataUtils';
import { TEST_SIGNUP_ID } from '../constants';

const signup = fakeSignup({
  contact_person: fakeContactPerson({
    phone_number: '0441234567',
  }),
  id: TEST_SIGNUP_ID,
  date_of_birth: formatDate(subYears(new Date(), 15), 'yyyy-MM-dd'),
  is_created_by_current_user: true,
  phone_number: '0441234567',
  user_consent: true,
});

export { signup };
