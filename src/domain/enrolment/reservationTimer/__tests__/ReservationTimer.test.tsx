/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-require-imports */
import { rest } from 'msw';
import * as nextAuth from 'next-auth/react';
import mockRouter from 'next-router-mock';
import singletonRouter from 'next/router';
import React from 'react';

import {
  fakeSeatsReservation,
  getMockedSeatsReservationData,
  setSignupGroupFormSessionStorageValues,
} from '../../../../utils/mockDataUtils';
import { fakeAuthenticatedSession } from '../../../../utils/mockSession';
import {
  render,
  screen,
  setQueryMocks,
  userEvent,
  waitFor,
  within,
} from '../../../../utils/testUtils';
import { ROUTES } from '../../../app/routes/constants';
import { registration } from '../../../registration/__mocks__/registration';
import { TEST_REGISTRATION_ID } from '../../../registration/constants';
import {
  SignupServerErrorsContext,
  SignupServerErrorsContextProps,
} from '../../../signup/signupServerErrorsContext/SignupServerErrorsContext';
import { EnrolmentPageProvider } from '../../enrolmentPageContext/EnrolmentPageContext';
import ReservationTimer from '../ReservationTimer';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

const defaultServerErrorsProps: SignupServerErrorsContextProps = {
  serverErrorItems: [],
  setServerErrorItems: jest.fn(),
  showServerErrors: jest.fn(),
};

const session = fakeAuthenticatedSession();

const renderComponent = (
  serverErrorProps?: Partial<SignupServerErrorsContextProps>
) =>
  render(
    <EnrolmentPageProvider>
      <SignupServerErrorsContext.Provider
        value={{ ...defaultServerErrorsProps, ...serverErrorProps }}
      >
        <ReservationTimer
          callbacksDisabled={false}
          disableCallbacks={jest.fn()}
          initReservationData={true}
          registration={registration}
          setSignups={jest.fn()}
          signups={[]}
        />
      </SignupServerErrorsContext.Provider>
    </EnrolmentPageProvider>,
    { session }
  );

beforeEach(() => {
  jest.resetAllMocks();
  // Mock getSession return value
  (nextAuth as any).getSession = jest.fn().mockReturnValue(session);
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
});

test('should show server errors when creating seats reservation fails', async () => {
  const showServerErrors = jest.fn();

  setQueryMocks(
    rest.post(`*/seats_reservation/`, (req, res, ctx) =>
      res(ctx.status(400), ctx.json({}))
    )
  );
  singletonRouter.push({
    pathname: ROUTES.CREATE_SIGNUP_GROUP,
    query: { registrationId: TEST_REGISTRATION_ID },
  });
  renderComponent({ showServerErrors });

  await waitFor(() =>
    expect(showServerErrors).toBeCalledWith({ error: {} }, 'seatsReservation')
  );
});

test('should show modal if reserved seats are in waiting list', async () => {
  const user = userEvent.setup();
  setQueryMocks(
    rest.post(`*/seats_reservation/`, (req, res, ctx) =>
      res(
        ctx.status(201),
        ctx.json(fakeSeatsReservation({ seats: 1, in_waitlist: true }))
      )
    )
  );
  singletonRouter.push({
    pathname: ROUTES.CREATE_SIGNUP_GROUP,
    query: { registrationId: TEST_REGISTRATION_ID },
  });
  renderComponent();

  const modal = await screen.findByRole('dialog', {
    name: 'Ilmoittautujia on lisätty varausjonoon',
  });

  await user.click(within(modal).getByRole('button', { name: 'Sulje' }));

  await waitFor(() => expect(modal).not.toBeInTheDocument());
});

test('should route to create signup group page if reservation is expired', async () => {
  const user = userEvent.setup();

  setSignupGroupFormSessionStorageValues({
    registrationId: registration.id,
    seatsReservation: getMockedSeatsReservationData(-1000),
  });

  singletonRouter.push({
    pathname: ROUTES.CREATE_SIGNUP_GROUP_SUMMARY,
    query: { registrationId: registration.id },
  });
  renderComponent();

  const modal = await screen.findByRole(
    'dialog',
    { name: 'Varausaika on täynnä.' },
    { timeout: 5000 }
  );
  const tryAgainButton = within(modal).getByRole('button', {
    name: 'Yritä uudelleen',
  });

  await user.click(tryAgainButton);

  await waitFor(() =>
    expect(mockRouter.asPath).toBe(
      `/registration/${registration.id}/signup-group/create`
    )
  );
});

test('should reload page if reservation is expired and route is create signup group page', async () => {
  mockRouter.reload = jest.fn();
  const user = userEvent.setup();

  setSignupGroupFormSessionStorageValues({
    registrationId: registration.id,
    seatsReservation: getMockedSeatsReservationData(-1000),
  });

  singletonRouter.push({
    pathname: ROUTES.CREATE_SIGNUP_GROUP,
    query: { registrationId: registration.id },
  });
  renderComponent();

  const modal = await screen.findByRole(
    'dialog',
    { name: 'Varausaika on täynnä.' },
    { timeout: 5000 }
  );
  const tryAgainButton = within(modal).getByRole('button', {
    name: 'Yritä uudelleen',
  });

  await user.click(tryAgainButton);

  await waitFor(() => expect(mockRouter.reload).toBeCalled());
});
