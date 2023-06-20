import { renderHook, waitFor } from '@testing-library/react';

import { getQueryWrapper, setQueryMocks } from '../../../utils/testUtils';
import {
  languagesResponse,
  mockedLanguagesResponses,
  serviceLanguagesResponse,
} from '../__mocks__/languages';
import { useLanguagesQuery } from '../query';

test('should return all languages', async () => {
  setQueryMocks(...mockedLanguagesResponses);

  const wrapper = getQueryWrapper();
  const { result } = renderHook(() => useLanguagesQuery(), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

  expect(result.current.data).toEqual(languagesResponse);
});

test('should return service languages', async () => {
  setQueryMocks(...mockedLanguagesResponses);

  const wrapper = getQueryWrapper();
  const { result } = renderHook(
    () => useLanguagesQuery({ serviceLanguage: true }),
    { wrapper }
  );

  await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

  expect(result.current.data).toEqual(serviceLanguagesResponse);
});
