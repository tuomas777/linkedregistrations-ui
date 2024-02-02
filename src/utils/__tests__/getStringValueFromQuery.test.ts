import getStringValueFromQuery from '../getStringValueFromQuery';

describe('getStringValueFromQuery function', () => {
  it('should return string value by a key', () => {
    const accessCode = 'access-code';
    expect(
      getStringValueFromQuery({ access_code: accessCode }, 'access_code')
    ).toBe(accessCode);
    expect(
      getStringValueFromQuery(
        { access_code: [accessCode, 'access-code2'] },
        'access_code'
      )
    ).toBe(accessCode);
    expect(getStringValueFromQuery({}, 'access_code')).toBe('');
  });
});
