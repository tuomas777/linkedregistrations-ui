import { EnrolmentQueryVariables } from '../types';
import { enrolmentPathBuilder } from '../utils';

describe('enrolmentPathBuilder function', () => {
  const cases: [EnrolmentQueryVariables, string][] = [
    [{ enrolmentId: 'enrolment:1' }, '/signup/enrolment:1/'],
  ];

  it.each(cases)('should build correct path', (variables, expectedPath) =>
    expect(enrolmentPathBuilder(variables)).toBe(expectedPath)
  );
});
