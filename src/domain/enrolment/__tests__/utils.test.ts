import { fakeRegistration, fakeSignup } from '../../../utils/mockDataUtils';
import { REGISTRATION_MANDATORY_FIELDS } from '../../registration/constants';
import {
  ENROLMENT_FIELDS,
  NOTIFICATIONS,
  NOTIFICATION_TYPE,
} from '../constants';
import { EnrolmentQueryVariables } from '../types';
import {
  enrolmentPathBuilder,
  getEnrolmentDefaultInitialValues,
  getEnrolmentInitialValues,
  getEnrolmentNotificationsCode,
  getSignupDefaultInitialValues,
  isEnrolmentFieldRequired,
} from '../utils';

describe('enrolmentPathBuilder function', () => {
  const cases: [EnrolmentQueryVariables, string][] = [
    [{ enrolmentId: 'enrolment:1' }, '/signup/enrolment:1/'],
  ];

  it.each(cases)('should build correct path', (variables, expectedPath) =>
    expect(enrolmentPathBuilder(variables)).toBe(expectedPath)
  );
});

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

describe('getSignupDefaultInitialValues function', () => {
  it('should return signup initial values', () => {
    expect(getSignupDefaultInitialValues()).toEqual({
      city: '',
      dateOfBirth: '',
      extraInfo: '',
      firstName: '',
      inWaitingList: false,
      lastName: '',
      streetAddress: '',
      zipcode: '',
    });
  });
});

describe('getEnrolmentDefaultInitialValues function', () => {
  it('should return enrolment initial values', () => {
    expect(getEnrolmentDefaultInitialValues()).toEqual({
      accepted: false,
      email: '',
      extraInfo: '',
      membershipNumber: '',
      nativeLanguage: '',
      notifications: [NOTIFICATIONS.EMAIL],
      phoneNumber: '',
      serviceLanguage: '',
      signups: [
        {
          city: '',
          dateOfBirth: '',
          extraInfo: '',
          firstName: '',
          inWaitingList: false,
          lastName: '',
          streetAddress: '',
          zipcode: '',
        },
      ],
    });
  });
});

describe('getEnrolmentInitialValues function', () => {
  it('should return default values if value is not set', () => {
    const {
      email,
      extraInfo,
      membershipNumber,
      nativeLanguage,
      notifications,
      phoneNumber,
      serviceLanguage,
      signups,
    } = getEnrolmentInitialValues(
      fakeSignup({
        city: null,
        date_of_birth: null,
        email: null,
        extra_info: null,
        first_name: null,
        last_name: null,
        membership_number: null,
        native_language: null,
        notifications: NOTIFICATION_TYPE.EMAIL,
        phone_number: null,
        service_language: null,
        street_address: null,
        zipcode: null,
      })
    );

    expect(signups).toEqual([
      {
        city: '-',
        dateOfBirth: '',
        extraInfo: '',
        firstName: '-',
        inWaitingList: false,
        lastName: '-',
        streetAddress: '-',
        zipcode: '-',
      },
    ]);
    expect(email).toBe('-');
    expect(extraInfo).toBe('-');
    expect(membershipNumber).toBe('-');
    expect(nativeLanguage).toBe('');
    expect(notifications).toEqual([NOTIFICATIONS.EMAIL]);
    expect(phoneNumber).toBe('-');
    expect(serviceLanguage).toBe('');
  });

  it('should return enrolment initial values', () => {
    const expectedCity = 'City';
    const expectedDateOfBirth = '10.10.2021';
    const expectedEmail = 'user@email.com';
    const expectedExtraInfo = 'Extra info';
    const expectedFirstName = 'First name';
    const expectedLastName = 'Last name';
    const expectedMembershipNumber = 'XXX-XXX-XXX';
    const expectedNativeLanguage = 'fi';
    const expectedNotifications = [NOTIFICATIONS.EMAIL];
    const expectedPhoneNumber = '+358 44 123 4567';
    const expectedServiceLanguage = 'sv';
    const expectedStreetAddress = 'Test address';
    const expectedZip = '12345';

    const {
      email,
      extraInfo,
      membershipNumber,
      nativeLanguage,
      notifications,
      phoneNumber,
      serviceLanguage,
      signups,
    } = getEnrolmentInitialValues(
      fakeSignup({
        city: expectedCity,
        date_of_birth: '2021-10-10',
        email: expectedEmail,
        extra_info: expectedExtraInfo,
        first_name: expectedFirstName,
        last_name: expectedLastName,
        membership_number: expectedMembershipNumber,
        native_language: expectedNativeLanguage,
        notifications: NOTIFICATION_TYPE.EMAIL,
        phone_number: expectedPhoneNumber,
        service_language: expectedServiceLanguage,
        street_address: expectedStreetAddress,
        zipcode: expectedZip,
      })
    );

    expect(signups).toEqual([
      {
        city: expectedCity,
        dateOfBirth: expectedDateOfBirth,
        extraInfo: '',
        firstName: expectedFirstName,
        inWaitingList: false,
        lastName: expectedLastName,
        streetAddress: expectedStreetAddress,
        zipcode: expectedZip,
      },
    ]);
    expect(email).toBe(expectedEmail);
    expect(extraInfo).toBe(expectedExtraInfo);
    expect(membershipNumber).toBe(expectedMembershipNumber);
    expect(nativeLanguage).toBe(expectedNativeLanguage);
    expect(notifications).toEqual(expectedNotifications);
    expect(phoneNumber).toBe(expectedPhoneNumber);
    expect(serviceLanguage).toBe(expectedServiceLanguage);
  });
});

describe('isEnrolmentFieldRequired', () => {
  const falseCases: [string[], ENROLMENT_FIELDS][] = [
    [[REGISTRATION_MANDATORY_FIELDS.PHONE_NUMBER], ENROLMENT_FIELDS.EMAIL],
    [[REGISTRATION_MANDATORY_FIELDS.PHONE_NUMBER], ENROLMENT_FIELDS.EXTRA_INFO],
    [
      [REGISTRATION_MANDATORY_FIELDS.PHONE_NUMBER],
      ENROLMENT_FIELDS.MEMBERSHIP_NUMBER,
    ],
    [
      [REGISTRATION_MANDATORY_FIELDS.PHONE_NUMBER],
      ENROLMENT_FIELDS.NATIVE_LANGUAGE,
    ],
    [
      [REGISTRATION_MANDATORY_FIELDS.PHONE_NUMBER],
      ENROLMENT_FIELDS.SERVICE_LANGUAGE,
    ],
    [['not-exist'], ENROLMENT_FIELDS.SERVICE_LANGUAGE],
  ];

  it.each(falseCases)(
    'should return false if field is not mandatory with args %p, result %p',
    (mandatory_fields, field) =>
      expect(
        isEnrolmentFieldRequired(fakeRegistration({ mandatory_fields }), field)
      ).toBe(false)
  );

  const trueCases: [string[], ENROLMENT_FIELDS][] = [
    [
      [REGISTRATION_MANDATORY_FIELDS.PHONE_NUMBER],
      ENROLMENT_FIELDS.PHONE_NUMBER,
    ],
  ];

  it.each(trueCases)(
    'should return false if field is not mandatory with args %p, result %p',
    (mandatory_fields, field) =>
      expect(
        isEnrolmentFieldRequired(fakeRegistration({ mandatory_fields }), field)
      ).toBe(true)
  );
});
