export enum SUPPORTED_LANGUAGES {
  FI = 'fi',
  SV = 'sv',
  EN = 'en',
}

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.FI;

export enum VALIDATION_MESSAGE_KEYS {
  AGE_MAX = 'validation.age.max',
  AGE_MIN = 'validation.age.min',
  ARRAY_MIN = 'validation.array.min',
  ARRAY_REQUIRED = 'validation.array.required',
  CAPACITY_MAX = 'validation.capacity.max',
  CAPACITY_MIN = 'validation.capacity.min',
  DATE = 'validation.string.date',
  EMAIL = 'validation.string.email',
  PHONE = 'validation.string.phone',
  SIGNUP_ACCEPTED = 'validation.signupAccepted',
  STRING_REQUIRED = 'validation.string.required',
  ZIP = 'validation.string.zip',
}

export const PAGE_HEADER_ID = 'page-header';
export const MAIN_CONTENT_ID = 'maincontent';

export const DATE_FORMAT = 'd.M.yyyy';

export enum RESERVATION_NAMES {
  SIGNUP_RESERVATION = 'signup-reservation',
}

export enum FORM_NAMES {
  CREATE_SIGNUP_GROUP_FORM = 'create-signup-group-form',
}
