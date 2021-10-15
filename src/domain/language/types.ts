import { LocalisedObject, Meta } from '../api/types';

export type LELanguage = {
  id: string;
  translation_available: boolean;
  name: LocalisedObject;
  '@id': string;
  '@context': string;
  '@type': string;
};

export type LanguagesResponse = {
  meta: Meta;
  data: LELanguage[];
};
