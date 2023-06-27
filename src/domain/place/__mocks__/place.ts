import { fakeLocalisedObject, fakePlace } from '../../../utils/mockDataUtils';
import { TEST_PLACE_ID } from '../constants';
import { Place } from '../types';

export const locationName = 'Place name';
export const streetAddress = 'Street address';
export const addressLocality = 'Address locality';

export const placeOverrides: Partial<Place> = {
  id: TEST_PLACE_ID,
  address_locality: fakeLocalisedObject(addressLocality),
  name: fakeLocalisedObject(locationName),
  street_address: fakeLocalisedObject(streetAddress),
};

export const place = fakePlace({ ...placeOverrides });
