import { LocalisedObject } from '../../domain/api/types';
import { Language } from '../../types';
import getLocalisedString from '../getLocalisedString';

const dummyLocalisedObj: LocalisedObject = {
  en: 'text en',
  fi: 'text fi',
  sv: 'text sv',
};

describe('getLocalisedString function', () => {
  it('should return localised string', () => {
    expect(getLocalisedString(dummyLocalisedObj, 'en')).toBe('text en');
    expect(getLocalisedString(dummyLocalisedObj, 'fi')).toBe('text fi');
  });

  it('should return string in backup language value with selected language is not found', () => {
    expect(getLocalisedString(dummyLocalisedObj, 'ru' as Language)).toBe(
      'text fi'
    );
  });

  it('should return empty string when object is null', () => {
    expect(getLocalisedString(null, 'en')).toBe('');
  });

  it('should return empty string when object all languages are not defined', () => {
    expect(getLocalisedString({}, 'en')).toBe('');
  });
});
