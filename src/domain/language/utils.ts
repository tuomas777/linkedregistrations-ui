import { AxiosError } from 'axios';
import { capitalize } from 'lodash';

import { OptionType, Language, ExtendedSession } from '../../types';
import getLocalisedString from '../../utils/getLocalisedString';
import queryBuilder from '../../utils/queryBuilder';
import { callGet } from '../app/axios/axiosClient';
import {
  LanguagesQueryVariables,
  LanguagesResponse,
  LELanguage,
} from './types';

export const fetchLanguages = async (
  args: LanguagesQueryVariables,
  session: ExtendedSession | null
): Promise<LanguagesResponse> => {
  try {
    const { data } = await callGet({
      session,
      url: languagesPathBuilder(args),
    });
    return data;
  } catch (error) {
    /* istanbul ignore next */
    throw Error(JSON.stringify((error as AxiosError).response?.data));
  }
};

export const languagesPathBuilder = (args: LanguagesQueryVariables): string => {
  const { serviceLanguage } = args;
  const variableToKeyItems = [
    { key: 'service_language', value: serviceLanguage },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/language/${query}`;
};

export const getLanguageOption = (
  language: LELanguage,
  locale: Language
): OptionType => ({
  label: capitalize(getLocalisedString(language.name, locale)),
  value: language.id,
});

export const sortLanguageOptions = (a: OptionType, b: OptionType): number =>
  a.label > b.label ? 1 : -1;
