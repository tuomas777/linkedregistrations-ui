import isValidDate from '../isValidDate';

const testCases: [string, boolean][] = [
  ['1.1.2019', true],
  ['1.1.201', false],
  ['01.01.2019', true],
  ['32.1.2019', false],
  ['1.13.2019', false],
  ['1.1.9999', false],
  ['29.02.2020', true],
  ['29.02.2021', false],
];

test.each(testCases)(
  'should validate date string correctly with string %p, result %p',
  (dateStr, expectedResult) => {
    expect(isValidDate(dateStr)).toBe(expectedResult);
  }
);
