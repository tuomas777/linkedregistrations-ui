import { fakeSignup } from '../../../utils/mockDataUtils';
import { TEST_ENROLMENT_ID } from '../constants';

const enrolment = fakeSignup({
  id: TEST_ENROLMENT_ID,
});

export { enrolment };
