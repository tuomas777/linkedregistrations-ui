import {
  fakeEvent,
  fakeLocalisedObject,
  fakeOffers,
} from '../../../utils/mockDataUtils';
import { imagesResponse } from '../../image/__mocks__/image';
import { keywordsResponse } from '../../keyword/__mocks__/keyword';
import {
  addressLocality,
  locationName,
  place,
  streetAddress,
} from '../../place/__mocks__/place';
import { TEST_EVENT_ID } from '../constants';

export const eventName = 'Event name';
export const eventOverrides = {
  id: TEST_EVENT_ID,
  audience_max_age: 15,
  audience_min_age: 8,
  description: fakeLocalisedObject('Event description'),
  end_time: '2020-07-13T12:00:00.000000Z',
  keywords: keywordsResponse.data,
  images: imagesResponse.data,
  name: fakeLocalisedObject(eventName),
  location: place,
  offers: fakeOffers(1, [
    { is_free: false, price: fakeLocalisedObject('Event price') },
  ]),
  start_time: '2020-07-10T12:00:00.000000Z',
};

export const locationText = [locationName, streetAddress, addressLocality].join(
  ', '
);

export const event = fakeEvent({ ...eventOverrides });
