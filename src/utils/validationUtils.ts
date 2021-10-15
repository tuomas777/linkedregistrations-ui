import { TFunction } from 'next-i18next';

import { Error } from '../types';

export const createMinErrorMessage = (
  message: { min: number },
  key: string
): Record<string, unknown> => {
  return {
    ...message,
    key,
  };
};

export const isValidPhoneNumber = (phone: string): boolean =>
  /^\+?\(?[0-9]{1,3}\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})?/.test(
    phone
  );

export const isValidZip = (zip: string): boolean => /^[0-9]{5}$/.test(zip);

/** Get string error text
 * @param {string} error
 * @param {boolean} touched
 * @param {Function} t
 * @return {string}
 */
export const getErrorText = (
  error: string | Error<Record<string, unknown>> | undefined,
  touched: boolean,
  t: TFunction
): string => {
  return !!error && touched
    ? typeof error === 'string'
      ? t(error)
      : t(error.key, error)
    : '';
};
