import {
  fakeRegistration,
  fakeRegistrations,
} from '../../../utils/mockDataUtils';
import { registration } from '../../registration/__mocks__/registration';
import {
  ENROLMENT_INITIAL_VALUES,
  NOTIFICATIONS,
  NOTIFICATION_TYPE,
} from '../constants';
import {
  getEnrolmentFormInitialValues,
  getEnrolmentNotificationsCode,
  getEnrolmentPayload,
} from '../utils';

describe('getEnrolmentNotificationsCode function', () => {
  it('should return correct notification core', () => {
    expect(getEnrolmentNotificationsCode([])).toBe(
      NOTIFICATION_TYPE.NO_NOTIFICATION
    );
    expect(getEnrolmentNotificationsCode([NOTIFICATIONS.SMS])).toBe(
      NOTIFICATION_TYPE.SMS
    );
    expect(getEnrolmentNotificationsCode([NOTIFICATIONS.EMAIL])).toBe(
      NOTIFICATION_TYPE.EMAIL
    );
    expect(
      getEnrolmentNotificationsCode([NOTIFICATIONS.EMAIL, NOTIFICATIONS.SMS])
    ).toBe(NOTIFICATION_TYPE.SMS_EMAIL);
  });
});

describe('getEnrolmentPayload function', () => {
  it('should return single enrolment as payload', () => {
    expect(getEnrolmentPayload(ENROLMENT_INITIAL_VALUES, registration)).toEqual(
      {
        city: null,
        date_of_birth: null,
        email: null,
        extra_info: '',
        membership_number: '',
        name: null,
        native_language: null,
        notifications: NOTIFICATION_TYPE.NO_NOTIFICATION,
        phone_number: null,
        registration: registration.id,
        service_language: null,
        street_address: null,
        zipcode: null,
      }
    );

    const city = 'City',
      dateOfBirth = '10.10.1999',
      email = 'Email',
      extraInfo = 'Extra info',
      membershipNumber = 'XXX-123',
      name = 'Name',
      nativeLanguage = 'fi',
      notifications = [NOTIFICATIONS.EMAIL],
      phoneNumber = '0441234567',
      serviceLanguage = 'sv',
      streetAddress = 'Street address',
      zipcode = '00100';
    const payload = getEnrolmentPayload(
      {
        ...ENROLMENT_INITIAL_VALUES,
        city,
        dateOfBirth,
        email,
        extraInfo,
        membershipNumber,
        name,
        nativeLanguage,
        notifications,
        phoneNumber,
        serviceLanguage,
        streetAddress,
        zip: zipcode,
      },
      registration
    );

    expect(payload).toEqual({
      city,
      date_of_birth: '1999-10-10',
      email,
      extra_info: extraInfo,
      membership_number: membershipNumber,
      name,
      native_language: nativeLanguage,
      notifications: NOTIFICATION_TYPE.EMAIL,
      phone_number: phoneNumber,
      registration: registration.id,
      service_language: serviceLanguage,
      street_address: streetAddress,
      zipcode,
    });
  });
});

describe('getEnrolmentFormInitialValues function', () => {
  it('should return enrolment initial values', () => {
    expect(
      getEnrolmentFormInitialValues(
        fakeRegistration({
          audience_max_age: 18,
          audience_min_age: 8,
        })
      )
    ).toEqual({
      accepted: false,
      audienceMaxAge: 18,
      audienceMinAge: 8,
      city: '',
      dateOfBirth: '',
      email: '',
      extraInfo: '',
      membershipNumber: '',
      name: '',
      nativeLanguage: '',
      notifications: [],
      phoneNumber: '',
      serviceLanguage: '',
      streetAddress: '',
      zip: '',
    });

    expect(
      getEnrolmentFormInitialValues(
        fakeRegistration({
          audience_max_age: null,
          audience_min_age: null,
        })
      )
    ).toEqual({
      accepted: false,
      audienceMaxAge: null,
      audienceMinAge: null,
      city: '',
      dateOfBirth: '',
      email: '',
      extraInfo: '',
      membershipNumber: '',
      name: '',
      nativeLanguage: '',
      notifications: [],
      phoneNumber: '',
      serviceLanguage: '',
      streetAddress: '',
      zip: '',
    });
  });
});
