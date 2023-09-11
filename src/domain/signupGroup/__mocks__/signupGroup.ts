import { fakeSignup, fakeSignupGroup } from '../../../utils/mockDataUtils';
import { TEST_SIGNUP_ID } from '../../signup/constants';
import { TEST_SIGNUP_GROUP_ID } from '../constants';

const signupGroup = fakeSignupGroup({
  id: TEST_SIGNUP_GROUP_ID,
  signups: [fakeSignup({ id: TEST_SIGNUP_ID })],
});

export { signupGroup };
