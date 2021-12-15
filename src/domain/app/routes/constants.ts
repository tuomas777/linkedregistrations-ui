export enum ROUTES {
  CREATE_ENROLMENT = '/registration/[registrationId]/enrolment/create',
  ENROLMENT_COMPLETED = '/registration/[registrationId]/enrolment/[enrolmentId]/completed/[accessCode]',
  ENROLMENT_CANCELLED = '/registration/[registrationId]/enrolment/cancelled',
  HOME = '/',
}
