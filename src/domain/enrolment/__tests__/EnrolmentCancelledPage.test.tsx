import { rest } from 'msw';
import React from 'react';

import { fakeRegistration } from '../../../utils/mockDataUtils';
import { render, screen, setQueryMocks } from '../../../utils/testUtils';
import { event, eventOverrides } from '../../event/__mocks__/event';
import { TEST_EVENT_ID } from '../../event/constants';
import { TEST_REGISTRATION_ID } from '../../registration/constants';
import EnrolmentCancelledPage from '../EnrolmentCancelledPage';

const renderComponent = () =>
  render(<EnrolmentCancelledPage />, {
    query: { registrationId: TEST_REGISTRATION_ID },
  });

test('should show enrolment cancelled text', async () => {
  const registration = fakeRegistration({
    id: TEST_REGISTRATION_ID,
    event: TEST_EVENT_ID,
  });

  setQueryMocks(
    rest.get(`*/event/${TEST_EVENT_ID}/`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(event))
    ),
    rest.get(`*/registration/${TEST_REGISTRATION_ID}`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(registration))
    )
  );
  renderComponent();

  await screen.findByRole('heading', { name: 'Ilmoittautumisesi on peruttu' });
  screen.getByText(
    `Olet perunut ilmoittautumisesi tapahtumaamme ${eventOverrides.name.fi}.`
  );
});
