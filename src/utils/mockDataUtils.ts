/* eslint-disable @typescript-eslint/no-explicit-any */
import faker from 'faker';
import merge from 'lodash/merge';

import { LocalisedObject, Meta } from '../domain/api/types';
import { LanguagesResponse, LELanguage } from '../domain/language/types';
import { getLinkedEventsUrl } from './getLinkedEventsPath';

export const fakeLanguages = (
  count = 1,
  languages?: Partial<LELanguage>[]
): LanguagesResponse => ({
  data: generateNodeArray((i) => fakeLanguage(languages?.[i]), count),
  meta: fakeMeta(count),
});

export const fakeLanguage = (overrides?: Partial<LELanguage>): LELanguage => {
  const id = overrides?.id || faker.datatype.uuid();

  return merge<LELanguage, typeof overrides>(
    {
      id,
      translation_available: false,
      name: fakeLocalisedObject(),
      '@id': getLinkedEventsUrl(`/language/${id}/`),
      '@context': 'http://schema.org',
      '@type': 'Language',
    },
    overrides
  );
};

export const fakeLocalisedObject = (text?: string): LocalisedObject => ({
  ar: faker.random.words(),
  en: faker.random.words(),
  fi: text || faker.random.words(),
  ru: faker.random.words(),
  sv: faker.random.words(),
  zh_hans: faker.random.words(),
});

export const fakeMeta = (count = 1, overrides?: Partial<Meta>): Meta =>
  merge<Meta, typeof overrides>(
    {
      count: count,
      next: '',
      previous: '',
    },
    overrides
  );

const generateNodeArray = <T extends (...args: any) => any>(
  fakeFunc: T,
  length: number
): ReturnType<T>[] => {
  return Array.from({ length }).map((_, i) => fakeFunc(i));
};
