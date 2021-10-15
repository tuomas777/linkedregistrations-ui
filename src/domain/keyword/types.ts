import { LocalisedObject, Meta, stringOrNull } from '../api/types';
import { ImageOrNull } from '../image/types';

export type Keyword = {
  id: string;
  aggregate: boolean;
  alt_labels: string[];
  created_time: stringOrNull;
  data_source: stringOrNull;
  deprecated: boolean;
  has_upcoming_events: boolean;
  image: ImageOrNull;
  last_modified_time: stringOrNull;
  name: LocalisedObject;
  n_nvents: number;
  publisher: string;
  '@id': string;
  '@context': string;
  '@type': string;
};

export type KeywordsResponse = {
  meta: Meta;
  data: Keyword[];
};
