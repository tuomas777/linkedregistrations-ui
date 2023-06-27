import { renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';

import { getQueryWrapper, setQueryMocks } from '../../../../utils/testUtils';
import { mockedLanguagesResponses } from '../../../language/__mocks__/languages';
import useLanguageOptions from '../useLanguageOptions';

test('should return language options', async () => {
  setQueryMocks(...mockedLanguagesResponses);
  const wrapper = getQueryWrapper();

  const { result } = renderHook(() => useLanguageOptions(), { wrapper });

  await waitFor(() => expect(result.current.length).toBeTruthy());

  expect(result.current).toEqual([
    { label: 'Arabia', value: 'ar' },
    { label: 'Englanti', value: 'en' },
    { label: 'Espanja', value: 'es' },
    { label: 'Kiina', value: 'zh_hans' },
    { label: 'Persia', value: 'fa' },
    { label: 'Ranska', value: 'fr' },
    { label: 'Ruotsi', value: 'sv' },
    { label: 'Somali', value: 'so' },
    { label: 'Suomi', value: 'fi' },
    { label: 'Turkki', value: 'tr' },
    { label: 'Venäjä', value: 'ru' },
    { label: 'Viro', value: 'et' },
  ]);
});

test('should return service language options', async () => {
  setQueryMocks(...mockedLanguagesResponses);
  const wrapper = getQueryWrapper();

  const { result } = renderHook(
    () => useLanguageOptions({ serviceLanguage: true }),
    { wrapper }
  );

  await waitFor(() => expect(result.current.length).toBeTruthy());

  expect(result.current).toEqual([
    { label: 'Englanti', value: 'en' },
    { label: 'Ruotsi', value: 'sv' },
    { label: 'Suomi', value: 'fi' },
  ]);
});

test('should return empty array', async () => {
  setQueryMocks(
    rest.get('*/language/', (req, res, ctx) =>
      res(ctx.status(200), ctx.json({}))
    )
  );
  const wrapper = getQueryWrapper();

  const { result } = renderHook(() => useLanguageOptions(), { wrapper });

  expect(result.current).toEqual([]);
});
