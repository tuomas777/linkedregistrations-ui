import { registration } from '../../registration/__mocks__/registration';
import { getRegistrationTimeLeft } from '../utils';

describe('getRegistrationTimeLeft function', () => {
  it('should return 0 if data is not stored to session storage', () => {
    expect(getRegistrationTimeLeft(registration)).toEqual(0);
  });
});
