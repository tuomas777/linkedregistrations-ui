import { LocalisedObject, stringOrNull } from '../api/types';
import { ImageOrNull } from '../image/types';

type Division = {
  municipality: string;
  name: LocalisedObject;
  ocd_id: string;
  type: string;
};

type Position = {
  coordinates: number[];
  type: string;
};

export type Place = {
  id: string;
  address_country: stringOrNull;
  address_locality: LocalisedObject;
  address_region: stringOrNull;
  contact_type: stringOrNull;
  created_time: stringOrNull;
  custom_data: stringOrNull;
  data_source: stringOrNull;
  deleted: boolean;
  description: stringOrNull;
  divisions: Division[];
  email: stringOrNull;
  has_upcoming_events: boolean;
  image: ImageOrNull;
  info_url: LocalisedObject;
  last_modified_time: stringOrNull;
  name: LocalisedObject;
  n_events: number;
  parent: stringOrNull;
  position: Position | null;
  postal_code: stringOrNull;
  post_office_box_num: stringOrNull;
  publisher: string;
  replaced_by: stringOrNull;
  street_address: LocalisedObject;
  telephone: LocalisedObject;
  '@id': string;
  '@context': string;
  '@type': string;
};

export type PlaceFields = {
  addressLocality: string;
  name: string;
  streetAddress: string;
};
