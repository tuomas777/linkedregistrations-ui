import { stringOrNull } from '../api/types';

export type Image = {
  id: string;
  alt_text: stringOrNull;
  created_time: stringOrNull;
  cropping: stringOrNull;
  data_source: stringOrNull;
  last_modified_time: stringOrNull;
  license: stringOrNull;
  name: stringOrNull;
  photographer_name: stringOrNull;
  publisher: stringOrNull;
  url: stringOrNull;
  '@id': string;
  '@context': string;
  '@type': string;
};

export type ImageOrNull = Image | null;
