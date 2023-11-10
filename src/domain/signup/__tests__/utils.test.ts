/* eslint-disable @typescript-eslint/no-explicit-any */
import { fakeContactPerson, fakeSignup } from '../../../utils/mockDataUtils';
import { registration } from '../../registration/__mocks__/registration';
import {
  NOTIFICATIONS,
  SIGNUP_GROUP_INITIAL_VALUES,
} from '../../signupGroup/constants';
import {
  ATTENDEE_STATUS,
  NOTIFICATION_TYPE,
  TEST_CONTACT_PERSON_ID,
  TEST_SIGNUP_ID,
} from '../constants';
import { SignupInput, SignupQueryVariables } from '../types';
import {
  getSignupFields,
  getSignupGroupInitialValuesFromSignup,
  getUpdateSignupPayload,
  omitSensitiveDataFromSignupPayload,
  signupPathBuilder,
} from '../utils';

describe('signupPathBuilder function', () => {
  const cases: [SignupQueryVariables, string][] = [
    [{ id: 'signup:1' }, '/signup/signup:1/'],
  ];

  it.each(cases)('should build correct path', (variables, expectedPath) =>
    expect(signupPathBuilder(variables)).toBe(expectedPath)
  );
});

describe('getSignupFields function', () => {
  it('should return empty string for each field if value is null', () => {
    const {
      attendeeStatus,
      email,
      firstName,
      fullName,
      lastName,
      phoneNumber,
    } = getSignupFields({
      signup: fakeSignup({
        attendee_status: null as any,
        contact_person: fakeContactPerson({
          email: null,
          phone_number: null,
        }),
        first_name: null,
        last_name: null,
      }),
    });
    expect(attendeeStatus).toBe(ATTENDEE_STATUS.Attending);
    expect(email).toBe('');
    expect(firstName).toBe('');
    expect(fullName).toBe('');
    expect(lastName).toBe('');
    expect(phoneNumber).toBe('');
  });

  it('should return correct signup fields', () => {
    const {
      attendeeStatus,
      email,
      firstName,
      fullName,
      lastName,
      phoneNumber,
    } = getSignupFields({
      signup: fakeSignup({
        attendee_status: ATTENDEE_STATUS.Waitlisted,
        contact_person: fakeContactPerson({
          email: 'test@email.com',
          phone_number: '+358 44 1234567',
        }),
        first_name: 'Test',
        last_name: 'User',
      }),
    });
    expect(attendeeStatus).toBe(ATTENDEE_STATUS.Waitlisted);
    expect(email).toBe('test@email.com');
    expect(firstName).toBe('Test');
    expect(fullName).toBe('Test User');
    expect(lastName).toBe('User');
    expect(phoneNumber).toBe('+358 44 1234567');
  });
});

describe('getSignupGroupInitialValuesFromSignup function', () => {
  it('should return default values if value is not set', () => {
    const {
      contactPerson: {
        email,
        firstName: contactPersonFirstName,
        lastName: contactPersonLastName,
        membershipNumber,
        nativeLanguage,
        notifications,
        phoneNumber,
        serviceLanguage,
      },
      extraInfo,
      signups,
    } = getSignupGroupInitialValuesFromSignup(
      fakeSignup({
        city: null,
        contact_person: {
          email: null,
          first_name: null,
          id: TEST_CONTACT_PERSON_ID,
          last_name: null,
          membership_number: null,
          native_language: null,
          notifications: NOTIFICATION_TYPE.EMAIL,
          phone_number: null,
          service_language: null,
        },
        date_of_birth: null,
        extra_info: null,
        first_name: null,
        id: TEST_SIGNUP_ID,
        last_name: null,
        responsible_for_group: true,
        street_address: null,
        zipcode: null,
      })
    );

    expect(signups).toEqual([
      {
        city: '',
        dateOfBirth: '',
        extraInfo: '',
        firstName: '',
        id: TEST_SIGNUP_ID,
        inWaitingList: false,
        lastName: '',
        responsibleForGroup: true,
        streetAddress: '',
        zipcode: '',
      },
    ]);
    expect(email).toBe('');
    expect(contactPersonFirstName).toBe('');
    expect(contactPersonLastName).toBe('');
    expect(extraInfo).toBe('');
    expect(membershipNumber).toBe('');
    expect(nativeLanguage).toBe('');
    expect(notifications).toEqual([NOTIFICATIONS.EMAIL]);
    expect(phoneNumber).toBe('');
    expect(serviceLanguage).toBe('');
  });

  it('should return signup group initial values', () => {
    const expectedCity = 'City';
    const expectedContactPersonFirstName = 'Contact first name';
    const expectedContactPersonLastName = 'Contact last name';
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
    const expectedUserConsent = true;
    const expectedZip = '12345';

    const {
      contactPerson: {
        email,
        firstName: contactPersonFirstName,
        lastName: contactPersonLastName,
        membershipNumber,
        nativeLanguage,
        notifications,
        phoneNumber,
        serviceLanguage,
      },

      extraInfo,

      signups,
      userConsent,
    } = getSignupGroupInitialValuesFromSignup(
      fakeSignup({
        city: expectedCity,
        contact_person: {
          email: expectedEmail,
          first_name: expectedContactPersonFirstName,
          id: TEST_SIGNUP_ID,
          last_name: expectedContactPersonLastName,
          membership_number: expectedMembershipNumber,
          native_language: expectedNativeLanguage,
          notifications: NOTIFICATION_TYPE.EMAIL,
          phone_number: expectedPhoneNumber,
          service_language: expectedServiceLanguage,
        },
        date_of_birth: '2021-10-10',
        extra_info: expectedExtraInfo,
        first_name: expectedFirstName,
        id: TEST_SIGNUP_ID,
        last_name: expectedLastName,
        responsible_for_group: true,

        street_address: expectedStreetAddress,
        user_consent: expectedUserConsent,
        zipcode: expectedZip,
      })
    );

    expect(signups).toEqual([
      {
        city: expectedCity,
        dateOfBirth: expectedDateOfBirth,
        extraInfo: expectedExtraInfo,
        firstName: expectedFirstName,
        id: TEST_SIGNUP_ID,
        inWaitingList: false,
        lastName: expectedLastName,
        responsibleForGroup: true,
        streetAddress: expectedStreetAddress,
        zipcode: expectedZip,
      },
    ]);
    expect(email).toBe(expectedEmail);
    expect(contactPersonFirstName).toBe(expectedContactPersonFirstName);
    expect(contactPersonLastName).toBe(expectedContactPersonLastName);
    expect(extraInfo).toBe('');
    expect(membershipNumber).toBe(expectedMembershipNumber);
    expect(nativeLanguage).toBe(expectedNativeLanguage);
    expect(notifications).toEqual(expectedNotifications);
    expect(phoneNumber).toBe(expectedPhoneNumber);
    expect(serviceLanguage).toBe(expectedServiceLanguage);
    expect(userConsent).toBe(expectedUserConsent);
  });
});

describe('getUpdateSignupPayload function', () => {
  it('should return payload to update a signup', () => {
    expect(
      getUpdateSignupPayload({
        formValues: SIGNUP_GROUP_INITIAL_VALUES,
        hasSignupGroup: false,
        id: TEST_SIGNUP_ID,
        registration,
      })
    ).toEqual({
      city: '',
      contact_person: {
        email: null,
        id: null,
        first_name: '',
        last_name: '',
        membership_number: '',
        native_language: null,
        notifications: NOTIFICATION_TYPE.EMAIL,
        phone_number: null,
        service_language: null,
      },
      date_of_birth: null,
      extra_info: '',
      first_name: '',
      id: TEST_SIGNUP_ID,
      last_name: '',
      registration: registration.id,
      responsible_for_group: false,
      street_address: null,
      user_consent: false,
      zipcode: null,
    });
  });

  it('contact_person should be null if hasSignupGroup is true', () => {
    const { contact_person } = getUpdateSignupPayload({
      formValues: SIGNUP_GROUP_INITIAL_VALUES,
      hasSignupGroup: true,
      id: TEST_SIGNUP_ID,
      registration,
    });
    expect(contact_person).toBe(undefined);
  });

  it('should return update signup payload', () => {
    const city = 'City',
      contactPersonFirstName = 'Contact first name',
      contactPersonLastName = 'Contact first name',
      dateOfBirth = '10.10.1999',
      email = 'Email',
      extraInfo = 'Extra info',
      firstName = 'First name',
      lastName = 'Last name',
      membershipNumber = 'XXX-123',
      nativeLanguage = 'fi',
      notifications = [NOTIFICATIONS.EMAIL],
      phoneNumber = '0441234567',
      serviceLanguage = 'sv',
      streetAddress = 'Street address',
      zipcode = '00100';
    const signups = [
      {
        city,
        dateOfBirth,
        extraInfo,
        firstName,
        id: null,
        inWaitingList: false,
        lastName,
        responsibleForGroup: true,
        streetAddress,
        zipcode,
      },
    ];
    const payload = getUpdateSignupPayload({
      formValues: {
        ...SIGNUP_GROUP_INITIAL_VALUES,
        contactPerson: {
          email,
          firstName: contactPersonFirstName,
          id: TEST_CONTACT_PERSON_ID,
          lastName: contactPersonLastName,
          membershipNumber,
          nativeLanguage,
          notifications,
          phoneNumber,
          serviceLanguage,
        },
        extraInfo: '',
        signups,
      },
      hasSignupGroup: false,
      id: TEST_SIGNUP_ID,
      registration,
    });

    expect(payload).toEqual({
      city,
      contact_person: {
        email,
        first_name: contactPersonFirstName,
        id: TEST_CONTACT_PERSON_ID,
        last_name: contactPersonLastName,
        membership_number: membershipNumber,
        native_language: nativeLanguage,
        notifications: NOTIFICATION_TYPE.EMAIL,
        phone_number: phoneNumber,
        service_language: serviceLanguage,
      },
      date_of_birth: '1999-10-10',
      extra_info: extraInfo,
      first_name: firstName,
      id: TEST_SIGNUP_ID,
      last_name: lastName,
      registration: registration.id,
      responsible_for_group: true,
      street_address: streetAddress,
      user_consent: false,
      zipcode,
    });
  });
});

describe('omitSensitiveDataFromSignupPayload', () => {
  const signupPayload: SignupInput = {
    city: 'Helsinki',
    date_of_birth: '1999-10-10',
    contact_person: {
      email: 'test@email.com',
      first_name: 'First name',
      id: TEST_CONTACT_PERSON_ID,
      last_name: 'Last name',
      membership_number: 'XYZ',
      native_language: 'fi',
      notifications: NOTIFICATION_TYPE.EMAIL,
      phone_number: '0441234567',
      service_language: 'fi',
    },
    extra_info: 'Signup entra info',
    first_name: 'First name',
    id: '1',
    last_name: 'Last name',
    responsible_for_group: true,
    street_address: 'Address',
    user_consent: true,
    zipcode: '123456',
  };
  it('should omit sensitive data from payload', () => {
    const filteredPayload = omitSensitiveDataFromSignupPayload(
      signupPayload
    ) as SignupInput;
    expect(filteredPayload).toEqual({
      contact_person: {
        id: TEST_CONTACT_PERSON_ID,
        notifications: NOTIFICATION_TYPE.EMAIL,
      },
      id: '1',
      responsible_for_group: true,
      user_consent: true,
    });
    expect(filteredPayload.city).toBeUndefined();
    expect(filteredPayload.extra_info).toBeUndefined();
    expect(filteredPayload.extra_info).toBeUndefined();
    expect(filteredPayload.first_name).toBeUndefined();
    expect(filteredPayload.last_name).toBeUndefined();
    expect(filteredPayload.street_address).toBeUndefined();
    expect(filteredPayload.zipcode).toBeUndefined();
    expect(filteredPayload.street_address).toBeUndefined();
    expect(filteredPayload.zipcode).toBeUndefined();
  });

  it('contact person should be undefined if its not defined', () => {
    const payload: SignupInput = {
      ...signupPayload,
      contact_person: undefined,
    };

    const { contact_person } = omitSensitiveDataFromSignupPayload(payload);
    expect(contact_person).toBe(undefined);
  });
});
