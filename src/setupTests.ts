// Polyfill "window.fetch" used in the React component.
import 'whatwg-fetch';
import '@testing-library/jest-dom/extend-expect';
import './tests/initI18n';

import { toHaveNoViolations } from 'jest-axe';

import { server } from './tests/msw/server';

expect.extend(toHaveNoViolations);

// Mock scrollTo function
window.scrollTo = jest.fn();

beforeAll(() => {
  server.listen();
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

jest.setTimeout(1000000);
