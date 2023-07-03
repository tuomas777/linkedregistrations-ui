import { advanceTo, clear } from 'jest-date-mock';
import * as Yup from 'yup';

import { VALIDATION_MESSAGE_KEYS } from '../../../constants';
import { fakeRegistration } from '../../../utils/mockDataUtils';
import { REGISTRATION_MANDATORY_FIELDS } from '../../registration/constants';
import { Registration } from '../../registration/types';
import { NOTIFICATIONS } from '../constants';
import { AttendeeFields, EnrolmentFormFields } from '../types';
import {
  getAttendeeSchema,
  getEnrolmentSchema,
  isAboveMinAge,
  isBelowMaxAge,
} from '../validation';

afterEach(() => {
  clear();
});

const testAboveMinAge = async (minAge: number, date: string) => {
  try {
    await Yup.string()
      .test(
        'isAboveMinAge',
        () => ({
          key: VALIDATION_MESSAGE_KEYS.AGE_MIN,
          min: minAge,
        }),
        (date) => isAboveMinAge(date, minAge)
      )
      .validate(date);
    return true;
  } catch (e) {
    return false;
  }
};

const testBelowMaxAge = async (maxAge: number, date: string) => {
  try {
    await Yup.string()
      .test(
        'isBelowMaxAge',
        () => ({
          key: VALIDATION_MESSAGE_KEYS.AGE_MAX,
          max: maxAge,
        }),
        (date) => isBelowMaxAge(date, maxAge)
      )
      .validate(date);
    return true;
  } catch (e) {
    return false;
  }
};

const testAttendeeSchema = async (
  registration: Registration,
  attendee: AttendeeFields
) => {
  try {
    await getAttendeeSchema(registration).validate(attendee);
    return true;
  } catch (e) {
    return false;
  }
};

const testEnrolmentSchema = async (
  registration: Registration,
  enrolment: EnrolmentFormFields
) => {
  try {
    await getEnrolmentSchema(registration).validate(enrolment);
    return true;
  } catch (e) {
    return false;
  }
};

describe('isAboveMinAge function', () => {
  test('should return true value is null', async () => {
    advanceTo('2022-10-10');

    const result = await testAboveMinAge(9, '');

    expect(result).toBe(true);
  });

  test('should return false if age is less than min age', async () => {
    advanceTo('2022-10-10');

    const result = await testAboveMinAge(9, '1.1.2022');

    expect(result).toBe(false);
  });

  test('should return true if age is greater than min age', async () => {
    advanceTo('2022-10-10');

    const result = await testAboveMinAge(9, '1.1.2012');

    expect(result).toBe(true);
  });
});

describe('isBelowMaxAge function', () => {
  test('should return true if value is null', async () => {
    advanceTo('2022-10-10');

    const result = await testBelowMaxAge(9, '');

    expect(result).toBe(true);
  });

  test('should return false if age is greater than max age', async () => {
    advanceTo('2022-10-10');

    const result = await testBelowMaxAge(9, '1.1.2012');

    expect(result).toBe(false);
  });

  test('should return true if age is less than max age', async () => {
    advanceTo('2022-10-10');

    const result = await testBelowMaxAge(9, '1.1.2015');

    expect(result).toBe(true);
  });
});

describe('attendeeSchema function', () => {
  const registration = fakeRegistration();
  const validAttendee: AttendeeFields = {
    city: 'City',
    dateOfBirth: '1.1.2000',
    extraInfo: '',
    inWaitingList: true,
    name: 'name',
    streetAddress: 'Street address',
    zipcode: '00100',
  };

  test('should return true if attendee is valid', async () => {
    expect(await testAttendeeSchema(registration, validAttendee)).toBe(true);
  });

  test('should return false if name is missing', async () => {
    expect(
      await testAttendeeSchema(
        fakeRegistration({
          mandatory_fields: [REGISTRATION_MANDATORY_FIELDS.NAME],
        }),
        { ...validAttendee, name: '' }
      )
    ).toBe(false);
  });

  test('should return false if street address is missing', async () => {
    expect(
      await testAttendeeSchema(
        fakeRegistration({
          mandatory_fields: [REGISTRATION_MANDATORY_FIELDS.STREET_ADDRESS],
        }),
        { ...validAttendee, streetAddress: '' }
      )
    ).toBe(false);
  });

  test('should return false if date of birth is missing', async () => {
    expect(
      await testAttendeeSchema(fakeRegistration({ audience_min_age: 8 }), {
        ...validAttendee,
        dateOfBirth: '',
      })
    ).toBe(false);

    expect(
      await testAttendeeSchema(fakeRegistration({ audience_max_age: 12 }), {
        ...validAttendee,
        dateOfBirth: '',
      })
    ).toBe(false);
  });

  test('should return false if age is greater than max age', async () => {
    advanceTo('2022-10-10');

    expect(
      await testAttendeeSchema(fakeRegistration({ audience_max_age: 8 }), {
        ...validAttendee,
        dateOfBirth: '1.1.2012',
      })
    ).toBe(false);
  });

  test('should return false if age is less than min age', async () => {
    advanceTo('2022-10-10');

    expect(
      await testAttendeeSchema(fakeRegistration({ audience_min_age: 5 }), {
        ...validAttendee,
        dateOfBirth: '1.1.2022',
      })
    ).toBe(false);
  });

  test('should return false if city is missing', async () => {
    expect(
      await testAttendeeSchema(
        fakeRegistration({
          mandatory_fields: [REGISTRATION_MANDATORY_FIELDS.CITY],
        }),
        { ...validAttendee, city: '' }
      )
    ).toBe(false);
  });

  test('should return false if zip is missing', async () => {
    expect(
      await testAttendeeSchema(
        fakeRegistration({
          mandatory_fields: [REGISTRATION_MANDATORY_FIELDS.ZIPCODE],
        }),
        { ...validAttendee, zipcode: '' }
      )
    ).toBe(false);
  });

  test('should return false if zip is invalid', async () => {
    expect(
      await testAttendeeSchema(registration, {
        ...validAttendee,
        zipcode: '123456',
      })
    ).toBe(false);
  });
});

describe('testEnrolmentSchema function', () => {
  const registration = fakeRegistration();
  const validEnrolment: EnrolmentFormFields = {
    accepted: true,
    attendees: [],
    email: 'user@email.com',
    extraInfo: '',
    membershipNumber: '',
    nativeLanguage: 'fi',
    notifications: [NOTIFICATIONS.EMAIL],
    phoneNumber: '',
    serviceLanguage: 'fi',
  };

  test('should return true if enrolment data is valid', async () => {
    expect(await testEnrolmentSchema(registration, validEnrolment)).toBe(true);
  });

  test('should return false if email is missing', async () => {
    expect(
      await testEnrolmentSchema(registration, {
        ...validEnrolment,
        email: '',
      })
    ).toBe(false);
  });

  test('should return false if email is invalid', async () => {
    expect(
      await testEnrolmentSchema(registration, {
        ...validEnrolment,
        email: 'user@email.',
      })
    ).toBe(false);
  });

  test('should return false if phone number is missing', async () => {
    expect(
      await testEnrolmentSchema(registration, {
        ...validEnrolment,
        phoneNumber: '',
        notifications: [NOTIFICATIONS.SMS],
      })
    ).toBe(false);
  });

  test('should return false if phone number is invalid', async () => {
    expect(
      await testEnrolmentSchema(registration, {
        ...validEnrolment,
        phoneNumber: 'xxx',
      })
    ).toBe(false);
  });

  test('should return false if notifications is empty array', async () => {
    expect(
      await testEnrolmentSchema(registration, {
        ...validEnrolment,
        notifications: [],
      })
    ).toBe(false);
  });

  test('should return false if native language is empty', async () => {
    expect(
      await testEnrolmentSchema(registration, {
        ...validEnrolment,
        nativeLanguage: '',
      })
    ).toBe(false);
  });

  test('should return false if service language is empty', async () => {
    expect(
      await testEnrolmentSchema(registration, {
        ...validEnrolment,
        serviceLanguage: '',
      })
    ).toBe(false);
  });

  test('should return false if membership number is set as mandatory field but value is empty', async () => {
    expect(
      await testEnrolmentSchema(
        fakeRegistration({ mandatory_fields: ['membership_number'] }),
        {
          ...validEnrolment,
          membershipNumber: '',
        }
      )
    ).toBe(false);
  });

  test('should return false if extra info is set as mandatory field but value is empty', async () => {
    expect(
      await testEnrolmentSchema(
        fakeRegistration({ mandatory_fields: ['extra_info'] }),
        {
          ...validEnrolment,
          extraInfo: '',
        }
      )
    ).toBe(false);
  });

  test('should return false if phone number is set as mandatory field but value is empty', async () => {
    expect(
      await testEnrolmentSchema(
        fakeRegistration({ mandatory_fields: ['phone_number'] }),
        {
          ...validEnrolment,
          phoneNumber: '',
        }
      )
    ).toBe(false);
  });
});
