import { capitalize } from 'lodash';

import { OptionType, Language } from '../../types';
import getLocalisedString from '../../utils/getLocalisedString';
import { LanguagesResponse, LELanguage } from './types';

export const fetchLanguages = (): Promise<LanguagesResponse> =>
  fetch('https://api.hel.fi/linkedevents/v1/language').then((res) =>
    res.json()
  );

export const getLanguageOption = (
  language: LELanguage,
  locale: Language
): OptionType => ({
  label: capitalize(getLocalisedString(language.name, locale)),
  value: language.id,
});

export const sortLanguageOptions = (a: OptionType, b: OptionType): number =>
  a.label > b.label ? 1 : -1;
