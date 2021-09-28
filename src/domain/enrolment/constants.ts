import { EnrolmentFormFields } from './types';

// type Enrolment {
//     id: ID!
//     marketingAllowed: Boolean
//     nativeLanguage: String
//     notifications: String
//     organizationName: String
//     serviceLanguage: String
//   }
export enum ENROLMENT_FIELDS {
  CITY = 'city',
  EMAIL = 'email',
  EXTRA_INFO = 'extraInfo',
  MEMBERSHIP_NUMBER = 'membershipNumber',
  NAME = 'name',
  PHONE_NUMBER = 'phoneNumber',
  STREET_ADDRESS = 'streetAddress',
  YEAR_OF_BIRTH = 'yearOfBirth',
  ZIP = 'zip',
}

export const ENROLMENT_INITIAL_VALUES: EnrolmentFormFields = {
  [ENROLMENT_FIELDS.CITY]: '',
  [ENROLMENT_FIELDS.EMAIL]: '',
  [ENROLMENT_FIELDS.EXTRA_INFO]: '',
  [ENROLMENT_FIELDS.MEMBERSHIP_NUMBER]: '',
  [ENROLMENT_FIELDS.NAME]: '',
  [ENROLMENT_FIELDS.PHONE_NUMBER]: '',
  [ENROLMENT_FIELDS.STREET_ADDRESS]: '',
  [ENROLMENT_FIELDS.YEAR_OF_BIRTH]: '',
  [ENROLMENT_FIELDS.ZIP]: '',
};

export const ENROLMENT_FORM_SELECT_FIELDS = [ENROLMENT_FIELDS.YEAR_OF_BIRTH];
