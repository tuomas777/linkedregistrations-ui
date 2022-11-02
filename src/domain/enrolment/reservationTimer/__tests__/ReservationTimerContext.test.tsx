/* eslint-disable @typescript-eslint/no-require-imports */
import addSeconds from 'date-fns/addSeconds';
import subSeconds from 'date-fns/subSeconds';
import { rest } from 'msw';
import mockRouter from 'next-router-mock';
import singletonRouter from 'next/router';
import React from 'react';
import { toast } from 'react-toastify';

import { RESERVATION_NAMES } from '../../../../constants';
import { fakeSeatsReservation } from '../../../../utils/mockDataUtils';
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
import { SeatsReservation } from '../../../reserveSeats/types';
import { ReservationTimerProvider } from '../ReservationTimerContext';

jest.mock('next/dist/client/router', () => require('next-router-mock'));

const renderComponent = () =>
  render(
    <ReservationTimerProvider
      initializeReservationData={true}
      registration={registration}
    />
  );

beforeEach(() => {
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
  sessionStorage.clear();
});

const setSessionStorageValues = (reservation: SeatsReservation) => {
  jest.spyOn(sessionStorage, 'getItem').mockImplementation((key: string) => {
    switch (key) {
      case `${RESERVATION_NAMES.ENROLMENT_RESERVATION}-${registration.id}`:
        return reservation ? JSON.stringify(reservation) : '';
      default:
        return '';
    }
  });
};

const getReservationData = (expirationOffset: number) => {
  const now = new Date();
  let expiration = '';

  if (expirationOffset) {
    expiration = addSeconds(now, expirationOffset).toISOString();
  } else {
    expiration = subSeconds(now, expirationOffset).toISOString();
  }

  const reservation = fakeSeatsReservation({ expiration });

  return reservation;
};

test('should show toast message when creating seats reservation fails', async () => {
  toast.error = jest.fn();

  setQueryMocks(
    rest.post(`*/reserve_seats/`, (req, res, ctx) =>
      res(ctx.status(400), ctx.json({}))
    )
  );
  singletonRouter.push({
    pathname: ROUTES.CREATE_ENROLMENT,
    query: { registrationId: TEST_REGISTRATION_ID },
  });
  renderComponent();

  await waitFor(() =>
    expect(toast.error).toBeCalledWith('Failed to reserve seats')
  );
});

test('should route to create enrolment page if reservation is expired', async () => {
  const user = userEvent.setup();

  setSessionStorageValues(getReservationData(-1000));

  singletonRouter.push({
    pathname: ROUTES.CREATE_ENROLMENT_SUMMARY,
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
      `/registration/${registration.id}/enrolment/create`
    )
  );
});

test('should reload page if reservation is expired and route is create enrolment page', async () => {
  mockRouter.reload = jest.fn();
  const user = userEvent.setup();

  setSessionStorageValues(getReservationData(-1000));

  singletonRouter.push({
    pathname: ROUTES.CREATE_ENROLMENT,
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
