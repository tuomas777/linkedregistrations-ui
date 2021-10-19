import i18n from 'i18next';

import { registrationsResponse } from '../__mocks__/registration';
import { getRegistrationWarning } from '../utils';

describe('getRegistrationWarning', () => {
  it('should return empty string if it is possible to enrol to the event', () => {
    expect(
      getRegistrationWarning(registrationsResponse.data[0], i18n.t.bind(i18n))
    ).toBe('');
  });

  it('should return correct warning if there is space in waiting list', () => {
    expect(
      getRegistrationWarning(registrationsResponse.data[1], i18n.t.bind(i18n))
    ).toBe(
      'Ilmoittautuminen tähän tapahtumaan on vielä mahdollista, mutta jonopaikkoja on jäljellä vain 10 kpl.'
    );
  });

  it('should return correct warning if all spaces are gone and there are no waiting list', () => {
    expect(
      getRegistrationWarning(registrationsResponse.data[2], i18n.t.bind(i18n))
    ).toBe(
      'Ilmoittautuminen tähän tapahtumaan on tällä hetkellä suljettu. Kokeile myöhemmin uudelleen.'
    );
  });
  it('should return correct warning if it is not possible to enrol to the event', () => {
    expect(
      getRegistrationWarning(registrationsResponse.data[3], i18n.t.bind(i18n))
    ).toBe(
      'Ilmoittautuminen tähän tapahtumaan on tällä hetkellä suljettu. Kokeile myöhemmin uudelleen.'
    );
  });

  it('should return empty string if maximum attendee capacity is not set', () => {
    expect(
      getRegistrationWarning(registrationsResponse.data[4], i18n.t.bind(i18n))
    ).toBe('');
  });
});
