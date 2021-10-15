import {
  fakeLanguages,
  fakeLocalisedObject,
} from '../../../utils/mockDataUtils';

const languages = [
  {
    id: 'en',
    name: { ...fakeLocalisedObject('englanti') },
  },
  {
    id: 'sv',
    name: { ...fakeLocalisedObject('ruotsi') },
  },
  {
    id: 'fi',
    name: { ...fakeLocalisedObject('suomi') },
  },
  {
    id: 'ru',
    name: { ...fakeLocalisedObject('venäjä') },
  },
  {
    id: 'et',
    name: { ...fakeLocalisedObject('viro') },
  },
  {
    id: 'fr',
    name: { ...fakeLocalisedObject('ranska') },
  },
  {
    id: 'so',
    name: { ...fakeLocalisedObject('somali') },
  },
  {
    id: 'es',
    name: { ...fakeLocalisedObject('espanja') },
  },
  {
    id: 'tr',
    name: { ...fakeLocalisedObject('turkki') },
  },
  {
    id: 'fa',
    name: { ...fakeLocalisedObject('persia') },
  },
  {
    id: 'ar',
    name: { ...fakeLocalisedObject('arabia') },
  },
  {
    id: 'zh_hans',
    name: { ...fakeLocalisedObject('kiina') },
  },
];

const languagesResponse = fakeLanguages(languages.length, languages);

export { languages, languagesResponse };
