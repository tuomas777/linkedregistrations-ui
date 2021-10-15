import { ParsedUrlQuery } from 'querystring';

import { act, render, RenderResult, fireEvent } from '@testing-library/react';
import { RequestHandler } from 'msw';
import { RouterContext } from 'next/dist/shared/lib/router-context';
import { NextRouter } from 'next/router';
import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  QueryClientProviderProps,
} from 'react-query';
import wait from 'waait';

import { server } from '../tests/msw/server';

export const arrowUpKeyPressHelper = (): boolean =>
  fireEvent.keyDown(document, { code: 38, key: 'ArrowUp' });

export const arrowDownKeyPressHelper = (): boolean =>
  fireEvent.keyDown(document, { code: 40, key: 'ArrowDown' });

export const enterKeyPressHelper = (): boolean =>
  fireEvent.keyDown(document, { code: 13, key: 'Enter' });

export const escKeyPressHelper = (): boolean =>
  fireEvent.keyDown(document, { code: 27, key: 'Escape' });

const customRender: CustomRender = (
  ui,
  { path = '/', query = {}, router = {} } = {}
) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const Wrapper: React.FC = ({ children }) => (
    <RouterContext.Provider
      value={{
        ...mockRouter,
        ...router,
        ...(path ? { pathname: path, asPath: path, basePath: path } : {}),
        ...(query ? { query } : {}),
      }}
    >
      <QueryClientProvider client={queryClient}>
        {children as React.ReactElement}
      </QueryClientProvider>
    </RouterContext.Provider>
  );

  const renderResult = render(ui, { wrapper: Wrapper });
  return { ...renderResult };
};
const mockRouter: NextRouter = {
  basePath: '',
  pathname: '/',
  route: '/',
  asPath: '/',
  query: {},
  push: jest.fn(() => Promise.resolve(true)),
  replace: jest.fn(() => Promise.resolve(true)),
  reload: jest.fn(() => Promise.resolve(true)),
  prefetch: jest.fn(() => Promise.resolve()),
  back: jest.fn(() => Promise.resolve(true)),
  beforePopState: jest.fn(() => Promise.resolve(true)),
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isReady: true,
  isPreview: false,
};

export type CustomRenderOptions = {
  path?: string;
  query?: ParsedUrlQuery;
  router?: Partial<NextRouter>;
};

type CustomRender = {
  (ui: React.ReactElement, options?: CustomRenderOptions): CustomRenderResult;
};

export const setQueryMocks = (...handlers: RequestHandler[]): void => {
  server.use(...handlers);
};

export const getQueryWrapper = (): React.FC<QueryClientProviderProps> => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper: React.FC<QueryClientProviderProps> = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return wrapper;
};

type CustomRenderResult = RenderResult;

const actWait = (amount?: number): Promise<void> => act(() => wait(amount));

// eslint-disable-next-line import/export
export { actWait, customRender as render };

// re-export everything
// eslint-disable-next-line import/export
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
