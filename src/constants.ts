/* istanbul ignore next */
export const LINKED_EVENTS_URL =
  process.env.NEXT_PUBLIC_LINKED_EVENTS_URL ??
  'https://linkedevents-api.dev.hel.ninja/linkedevents-dev/v1';

export enum SUPPORTED_LANGUAGES {
  FI = 'fi',
  SV = 'sv',
  EN = 'en',
}

export const DEFAULT_LANGUAGE = SUPPORTED_LANGUAGES.FI;

export enum VALIDATION_MESSAGE_KEYS {
  ARRAY_MIN = 'validation.array.min',
  ARRAY_REQUIRED = 'form.validation.array.required',
  EMAIL = 'validation.string.email',
  ENROLMENT_ACCEPTED = 'validation.enrolmentAccepted',
  PHONE = 'validation.string.phone',
  STRING_REQUIRED = 'validation.string.required',
  ZIP = 'validation.string.zip',
}

export const PAGE_HEADER_ID = 'page-header';
export const MAIN_CONTENT_ID = 'maincontent';
