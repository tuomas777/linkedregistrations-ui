import { renderHook, waitFor } from '@testing-library/react';
import { rest } from 'msw';

import { getQueryWrapper, setQueryMocks } from '../../../utils/testUtils';
import { languagesResponse } from '../__mocks__/languages';
import { useLanguagesQuery } from '../query';

test('should return correct data for useLanguagesQuery', async () => {
  setQueryMocks(
    rest.get('*/language/', (req, res, ctx) =>
      res(ctx.status(200), ctx.json(languagesResponse))
    )
  );

  const wrapper = getQueryWrapper();
  const { result } = renderHook(() => useLanguagesQuery(), {
    wrapper,
  });

  await waitFor(() => expect(result.current.isSuccess).toBeTruthy());

  expect(result.current.data).toEqual(languagesResponse);
});
