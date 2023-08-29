export enum ROUTES {
  CALLBACK = '/api/auth/callback/tunnistamo',
  CREATE_SIGNUP_GROUP = '/registration/[registrationId]/signup-group/create',
  CREATE_SIGNUP_GROUP_SUMMARY = '/registration/[registrationId]/signup-group/create/summary',
  EDIT_ENROLMENT = '/registration/[registrationId]/enrolment/[enrolmentId]/edit',
  ENROLMENT_CANCELLED = '/registration/[registrationId]/enrolment/cancelled',
  HOME = '/',
  SIGNUP_GROUP_COMPLETED = '/registration/[registrationId]/signup-group/completed',
}
