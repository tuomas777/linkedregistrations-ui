import { fakeSignupGroup } from '../../../utils/mockDataUtils';
import { signup } from '../../signup/__mocks__/signup';
import { TEST_SIGNUP_GROUP_ID } from '../constants';

const signupGroup = fakeSignupGroup({
  id: TEST_SIGNUP_GROUP_ID,
  is_created_by_current_user: true,
  signups: [signup],
});

export { signupGroup };
