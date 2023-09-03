export enum ATTENDEE_STATUS {
  Attending = 'attending',
  Waitlisted = 'waitlisted',
}

export enum NOTIFICATION_TYPE {
  NO_NOTIFICATION = 'none',
  SMS = 'sms',
  EMAIL = 'email',
  SMS_EMAIL = 'sms and email',
}

export const TEST_SIGNUP_ID = 'signup:1';

export enum SIGNUP_ACTIONS {
  CREATE = 'create',
  DELETE = 'delete',
}

export enum SIGNUP_MODALS {
  DELETE = 'delete',
  DELETE_SIGNUP_FROM_FORM = 'deleteSignupFromForm',
  PERSONS_ADDED_TO_WAITLIST = 'personsAddedToWaitList',
  RESERVATION_TIME_EXPIRED = 'reservationTimeExpired',
}
