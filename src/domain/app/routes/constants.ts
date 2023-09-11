export enum ROUTES {
  CALLBACK = '/api/auth/callback/tunnistamo',
  CREATE_SIGNUP_GROUP = '/registration/[registrationId]/signup-group/create',
  CREATE_SIGNUP_GROUP_SUMMARY = '/registration/[registrationId]/signup-group/create/summary',
  EDIT_SIGNUP = '/registration/[registrationId]/signup/[signupId]/edit',
  HOME = '/',
  SIGNUP_CANCELLED = '/registration/[registrationId]/signup/cancelled',
  SIGNUP_GROUP_COMPLETED = '/registration/[registrationId]/signup-group/completed',
}
