import range from 'lodash/range';

import {
  fakeContactPerson,
  fakeSignupGroup,
  fakeSignups,
} from '../../../utils/mockDataUtils';
import { Meta } from '../../api/types';
import { TEST_SIGNUP_GROUP_ID } from '../../signupGroup/constants';

const TEST_PAGE_SIZE = 2;

const signupNames = range(1, TEST_PAGE_SIZE + 1).map((n) => ({
  first_name: 'First name',
  last_name: `Last name ${n}`,
}));
const signups = fakeSignups(
  TEST_PAGE_SIZE,
  signupNames.map((name, index) => ({
    ...name,
    contact_person: fakeContactPerson({ phone_number: `044123456${index}` }),
  }))
);
const count = 30;
const meta: Meta = { ...signups.meta, count };
signups.meta = meta;

const signupGroup = fakeSignupGroup({
  contact_person: fakeContactPerson({ phone_number: '044 1234567' }),
  id: TEST_SIGNUP_GROUP_ID,
});
const signupsWithGroup = fakeSignups(1, [
  { ...signupNames[0], id: `attending:1`, signup_group: signupGroup.id },
]);

const signupNamesPage2 = range(1, TEST_PAGE_SIZE + 1).map((n) => ({
  first_name: 'Page 2 user',
  last_name: `Last name ${n}`,
}));

const signupsPage2 = fakeSignups(
  TEST_PAGE_SIZE,
  signupNamesPage2.map((name) => ({ ...name }))
);

export {
  signupGroup,
  signupNames,
  signupNamesPage2,
  signups,
  signupsPage2,
  signupsWithGroup,
};
