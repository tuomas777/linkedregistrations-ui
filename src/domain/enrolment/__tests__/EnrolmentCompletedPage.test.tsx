import { rest } from 'msw';
import React from 'react';

import { fakeRegistration } from '../../../utils/mockDataUtils';
import { render, screen, setQueryMocks } from '../../../utils/testUtils';
import { event, eventOverrides } from '../../event/__mocks__/event';
import { TEST_EVENT_ID } from '../../event/constants';
import { TEST_REGISTRATION_ID } from '../../registration/constants';
import EnrolmentCompletedPage from '../EnrolmentCompletedPage';

const renderComponent = () =>
  render(<EnrolmentCompletedPage />, {
    query: { registrationId: TEST_REGISTRATION_ID },
  });

const defaultMocks = [
  rest.get(`*/event/${TEST_EVENT_ID}/`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(event))
  ),
];

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
