import { fakeRegistration, fakeSignup } from '../../../utils/mockDataUtils';
import {
  NOTIFICATIONS,
  NOTIFICATION_TYPE,
  SIGNUP_GROUP_FIELDS,
  SIGNUP_GROUP_INITIAL_VALUES,
  SIGNUP_INITIAL_VALUES,
} from '../../enrolment/constants';
import { registration } from '../../registration/__mocks__/registration';
import { REGISTRATION_MANDATORY_FIELDS } from '../../registration/constants';
import {
  getSignupDefaultInitialValues,
  getSignupGroupDefaultInitialValues,
  getSignupGroupInitialValues,
  getSignupGroupPayload,
  getSignupNotificationTypes,
  getSignupNotificationsCode,
  isSignupFieldRequired,
} from '../utils';

describe('getSignupGroupPayload function', () => {
  const reservationCode = 'code';

  it('should return signup group payload', () => {
    expect(
      getSignupGroupPayload({
        formValues: {
          ...SIGNUP_GROUP_INITIAL_VALUES,
          signups: [SIGNUP_INITIAL_VALUES],
        },
        registration,
        reservationCode,
      })
    ).toEqual({
      extra_info: '',
      registration: registration.id,
      reservation_code: 'code',
      signups: [
        {
          city: '',
          date_of_birth: null,
          email: null,
          extra_info: '',
          first_name: '',
          last_name: '',
          membership_number: '',
          native_language: null,
          notifications: NOTIFICATION_TYPE.EMAIL,
          phone_number: null,
          responsible_for_group: true,
          service_language: null,
          street_address: null,
          zipcode: null,
        },
      ],
    });

    const city = 'City',
      dateOfBirth = '10.10.1999',
      email = 'Email',
      extraInfo = 'Extra info',
      firstName = 'First name',
      groupExtraInfo = 'Group extra info',
      lastName = 'Last name',
      membershipNumber = 'XXX-123',
      nativeLanguage = 'fi',
      notifications = [NOTIFICATIONS.EMAIL],
      phoneNumber = '0441234567',
      serviceLanguage = 'sv',
      streetAddress = 'Street address',
      zipcode = '00100';
    const payload = getSignupGroupPayload({
      formValues: {
        ...SIGNUP_GROUP_INITIAL_VALUES,
        signups: [
          {
            city,
            dateOfBirth,
            extraInfo,
            firstName,
            inWaitingList: false,
            lastName,
            streetAddress,
            zipcode,
          },
        ],
        email,
        extraInfo: groupExtraInfo,
        membershipNumber,
        nativeLanguage,
        notifications,
        phoneNumber,
        serviceLanguage,
      },
      registration,
      reservationCode,
    });

    expect(payload).toEqual({
      extra_info: groupExtraInfo,
      registration: registration.id,
      reservation_code: reservationCode,
      signups: [
        {
          city,
          date_of_birth: '1999-10-10',
          email,
          extra_info: extraInfo,
          first_name: firstName,
          last_name: lastName,
          membership_number: membershipNumber,
          native_language: nativeLanguage,
          notifications: NOTIFICATION_TYPE.EMAIL,
          phone_number: phoneNumber,
          responsible_for_group: true,
          service_language: serviceLanguage,
          street_address: streetAddress,
          zipcode,
        },
      ],
    });
  });
});
describe('getSignupNotificationsCode function', () => {
  it('should return correct notification core', () => {
    expect(getSignupNotificationsCode([])).toBe(
      NOTIFICATION_TYPE.NO_NOTIFICATION
    );
    expect(getSignupNotificationsCode([NOTIFICATIONS.SMS])).toBe(
      NOTIFICATION_TYPE.SMS
    );
    expect(getSignupNotificationsCode([NOTIFICATIONS.EMAIL])).toBe(
      NOTIFICATION_TYPE.EMAIL
    );
    expect(
      getSignupNotificationsCode([NOTIFICATIONS.EMAIL, NOTIFICATIONS.SMS])
    ).toBe(NOTIFICATION_TYPE.SMS_EMAIL);
  });
});

describe('getSignupNotificationTypes function', () => {
  it('should return correct notification types', () => {
    expect(
      getSignupNotificationTypes(NOTIFICATION_TYPE.NO_NOTIFICATION)
    ).toEqual([]);
    expect(getSignupNotificationTypes(NOTIFICATION_TYPE.SMS)).toEqual([
      NOTIFICATIONS.SMS,
    ]);
    expect(getSignupNotificationTypes(NOTIFICATION_TYPE.EMAIL)).toEqual([
      NOTIFICATIONS.EMAIL,
    ]);
    expect(getSignupNotificationTypes(NOTIFICATION_TYPE.SMS_EMAIL)).toEqual([
      NOTIFICATIONS.EMAIL,
      NOTIFICATIONS.SMS,
    ]);
    expect(getSignupNotificationTypes('lorem ipsum')).toEqual([]);
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

describe('getSignupGroupDefaultInitialValues function', () => {
  it('should return enrolment initial values', () => {
    expect(getSignupGroupDefaultInitialValues()).toEqual({
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

describe('getSignupGroupInitialValues function', () => {
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
    } = getSignupGroupInitialValues(
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

  it('should return signup group initial values', () => {
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
    } = getSignupGroupInitialValues(
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

describe('isSignupFieldRequired', () => {
  const falseCases: [string[], SIGNUP_GROUP_FIELDS][] = [
    [[REGISTRATION_MANDATORY_FIELDS.PHONE_NUMBER], SIGNUP_GROUP_FIELDS.EMAIL],
    [
      [REGISTRATION_MANDATORY_FIELDS.PHONE_NUMBER],
      SIGNUP_GROUP_FIELDS.EXTRA_INFO,
    ],
    [
      [REGISTRATION_MANDATORY_FIELDS.PHONE_NUMBER],
      SIGNUP_GROUP_FIELDS.MEMBERSHIP_NUMBER,
    ],
    [
      [REGISTRATION_MANDATORY_FIELDS.PHONE_NUMBER],
      SIGNUP_GROUP_FIELDS.NATIVE_LANGUAGE,
    ],
    [
      [REGISTRATION_MANDATORY_FIELDS.PHONE_NUMBER],
      SIGNUP_GROUP_FIELDS.SERVICE_LANGUAGE,
    ],
    [['not-exist'], SIGNUP_GROUP_FIELDS.SERVICE_LANGUAGE],
  ];

  it.each(falseCases)(
    'should return false if field is not mandatory with args %p, result %p',
    (mandatory_fields, field) =>
      expect(
        isSignupFieldRequired(fakeRegistration({ mandatory_fields }), field)
      ).toBe(false)
  );

  const trueCases: [string[], SIGNUP_GROUP_FIELDS][] = [
    [
      [REGISTRATION_MANDATORY_FIELDS.PHONE_NUMBER],
      SIGNUP_GROUP_FIELDS.PHONE_NUMBER,
    ],
  ];

  it.each(trueCases)(
    'should return false if field is not mandatory with args %p, result %p',
    (mandatory_fields, field) =>
      expect(
        isSignupFieldRequired(fakeRegistration({ mandatory_fields }), field)
      ).toBe(true)
  );
});
