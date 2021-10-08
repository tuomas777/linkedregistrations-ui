import { fakePlace } from '../../../utils/mockDataUtils';
import { TEST_PLACE_ID } from '../constants';

export const placeOverrides = {
  id: TEST_PLACE_ID,
};

export const place = fakePlace({ ...placeOverrides });
