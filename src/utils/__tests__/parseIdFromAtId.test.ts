import parseIdFromAtId from '../parseIdFromAtId';

test("should return null if id doesn't exist", () => {
  expect(parseIdFromAtId(null)).toBe(null);
});

test('should return id', () => {
  expect(
    parseIdFromAtId(
      'https://linkedevents-api.dev.hel.ninja/linkedevents-dev/v1/place/tprek:8232/'
    )
  ).toBe('tprek:8232');
});
