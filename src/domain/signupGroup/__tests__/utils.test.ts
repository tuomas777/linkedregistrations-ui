import {
  ATTENDEE_INITIAL_VALUES,
  ENROLMENT_INITIAL_VALUES,
  NOTIFICATIONS,
  NOTIFICATION_TYPE,
} from '../../enrolment/constants';
import { registration } from '../../registration/__mocks__/registration';
import { getSignupGroupPayload, getSignupNotificationTypes } from '../utils';

describe('getSignupGroupPayload function', () => {
  const reservationCode = 'code';

  it('should return signup group payload', () => {
    expect(
      getSignupGroupPayload({
        formValues: {
          ...ENROLMENT_INITIAL_VALUES,
          attendees: [ATTENDEE_INITIAL_VALUES],
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
        ...ENROLMENT_INITIAL_VALUES,
        attendees: [
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
