import { Language } from '../../types';
import { getLinkedEventsUrl } from '../../utils/getLinkedEventsPath';
import getLocalisedString from '../../utils/getLocalisedString';
import { Place, PlaceFields } from './types';

export const fetchPlace = (id: string): Promise<Place> =>
  fetch(getLinkedEventsUrl(`/place/${id}`)).then((res) => res.json());

export const getPlaceFields = (place: Place, locale: Language): PlaceFields => {
  return {
    addressLocality: getLocalisedString(place.address_locality, locale),
    name: getLocalisedString(place.name, locale),
    streetAddress: getLocalisedString(place.street_address, locale),
  };
};
