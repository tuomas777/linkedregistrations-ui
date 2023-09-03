import { SignupQueryVariables } from '../types';
import { signupPathBuilder } from '../utils';

describe('signupPathBuilder function', () => {
  const cases: [SignupQueryVariables, string][] = [
    [{ id: 'signup:1' }, '/signup/signup:1/'],
  ];

  it.each(cases)('should build correct path', (variables, expectedPath) =>
    expect(signupPathBuilder(variables)).toBe(expectedPath)
  );
});
