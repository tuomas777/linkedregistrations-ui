import { LanguagesQueryVariables } from '../types';
import { languagesPathBuilder } from '../utils';

describe('languagesPathBuilder function', () => {
  const cases: [LanguagesQueryVariables, string][] = [
    [{}, '/language/'],
    [{ serviceLanguage: true }, '/language/?service_language=true'],
    [{ serviceLanguage: false }, '/language/?service_language=false'],
  ];

  it.each(cases)('should build correct path', (variables, expectedPath) =>
    expect(languagesPathBuilder(variables)).toBe(expectedPath)
  );
});
