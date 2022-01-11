import { fakeEnrolment } from '../../../utils/mockDataUtils';
import { TEST_ENROLMENT_CANCELLATION_CODE } from '../constants';

const enrolment = fakeEnrolment({
  cancellation_code: TEST_ENROLMENT_CANCELLATION_CODE,
});

export { enrolment };
