/* eslint-disable @typescript-eslint/ban-ts-comment */
import { rest } from 'msw';
import React from 'react';

import { fakeRegistration } from '../../../utils/mockDataUtils';
import {
  render,
  screen,
  setQueryMocks,
  waitFor,
} from '../../../utils/testUtils';
import { event, eventOverrides } from '../../event/__mocks__/event';
import { TEST_EVENT_ID } from '../../event/constants';
import { TEST_REGISTRATION_ID } from '../../registration/constants';
import { enrolment } from '../__mocks__/enrolment';
import {
  ENROLMENT_QUERY_PARAMS,
  TEST_ENROLMENT_CANCELLATION_CODE,
} from '../constants';
import EnrolmentCompletedPage from '../EnrolmentCompletedPage';

const renderComponent = (query?: {
  [ENROLMENT_QUERY_PARAMS.REDIRECT_URL]: string;
}) =>
  render(<EnrolmentCompletedPage />, {
    query: {
      accessCode: TEST_ENROLMENT_CANCELLATION_CODE,
      registrationId: TEST_REGISTRATION_ID,
      ...query,
    },
  });

const defaultMocks = [
  rest.get(`*/event/${TEST_EVENT_ID}/`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(event))
  ),
  rest.get(`*/signup/*`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(enrolment))
  ),
];

const { location } = window;

beforeAll((): void => {
  delete window.location;
  // @ts-ignore
  window.location = { href: '' };
});

afterAll((): void => {
  window.location = location;
});

test('should show default enrolment completed text', async () => {
  const registration = fakeRegistration({
    id: TEST_REGISTRATION_ID,
    event: TEST_EVENT_ID,
    confirmation_message: '',
  });

  setQueryMocks(
    ...defaultMocks,
    rest.get(`*/registration/${TEST_REGISTRATION_ID}`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(registration))
    )
  );
  renderComponent();

  await screen.findByRole('heading', { name: 'Kiitos ilmoittautumisestasi!' });
  screen.getByText(
    `Olet ilmoittanut tapahtumaamme ${eventOverrides.name.fi} – sydämellisesti tervetuloa!`
  );
});

test('should show custom confirmation message', async () => {
  const confirmationMessage = 'Custom confirmation message';
  const registration = fakeRegistration({
    id: TEST_REGISTRATION_ID,
    event: TEST_EVENT_ID,
    confirmation_message: confirmationMessage,
  });

  setQueryMocks(
    ...defaultMocks,
    rest.get(`*/registration/${TEST_REGISTRATION_ID}`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(registration))
    )
  );
  renderComponent();

  await screen.findByRole('heading', { name: 'Kiitos ilmoittautumisestasi!' });
  screen.getByText(confirmationMessage);
});

test('should sutomatically redirect user', async () => {
  const redirectUrl = 'https://www.google.com';
  const registration = fakeRegistration({
    id: TEST_REGISTRATION_ID,
    event: TEST_EVENT_ID,
    confirmation_message: '',
  });

  setQueryMocks(
    ...defaultMocks,
    rest.get(`*/registration/${TEST_REGISTRATION_ID}`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(registration))
    )
  );
  renderComponent({ redirect_url: redirectUrl });

  await waitFor(() => expect(window.location.href).toBe(redirectUrl), {
    timeout: 10000,
  });
});
