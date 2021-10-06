import { LocalisedObject, stringOrNull } from '../api/types';
import { ImageOrNull } from '../image/types';

export type Keyword = {
  id: string;
  aggregate: boolean;
  alt_labels: [string];
  created_time: stringOrNull;
  dataSource: stringOrNull;
  deprecated: boolean;
  hasUpcomingEvents: boolean;
  image: ImageOrNull;
  lastModifiedTime: stringOrNull;
  name: LocalisedObject;
  nEvents: number;
  publisher: string;
  '@id': string;
  '@context': string;
  '@type': string;
};
