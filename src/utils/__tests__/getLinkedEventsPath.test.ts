import { getLinkedEventsUrl } from '../getLinkedEventsPath';

const testCases = [
  [undefined, 'https://linkedevents-api.dev.hel.ninja/linkedevents-dev/v1/'],
  [
    'language',
    'https://linkedevents-api.dev.hel.ninja/linkedevents-dev/v1/language',
  ],
  [
    '/language',
    'https://linkedevents-api.dev.hel.ninja/linkedevents-dev/v1/language',
  ],
];

test.each(testCases)(
  'should return correct Linked event url with props %p, result %p',
  (path, expectedResult) => {
    expect(getLinkedEventsUrl(path)).toBe(expectedResult);
  }
);
