/* eslint-disable max-len */
import React from 'react';

import {
  fakeRegistration,
  getMockedSeatsReservationData,
  setSessionStorageValues,
} from '../../../../../utils/mockDataUtils';
import { configure, render, screen } from '../../../../../utils/testUtils';
import { TEST_REGISTRATION_ID } from '../../../../registration/constants';
import { Registration } from '../../../../registration/types';
import AvailableSeatsText from '../AvailableSeatsText';

configure({ defaultHidden: true });

const renderComponent = (registration: Registration) =>
  render(<AvailableSeatsText registration={registration} />);

test('should show amount of free seats', async () => {
  renderComponent(
    fakeRegistration({
      maximum_attendee_capacity: 10,
      current_attendee_count: 3,
      remaining_attendee_capacity: 7,
    })
  );

  screen.getByText('Saatavilla olevia paikkoja');
  await screen.findByText('7');
});

test('should show amount of remaining seats', async () => {
  renderComponent(
    fakeRegistration({
      maximum_attendee_capacity: 10,
      current_attendee_count: 3,
      remaining_attendee_capacity: 0,
    })
  );

  screen.getByText('Saatavilla olevia paikkoja');
  await screen.findByText('0');
});

test('should show amount of remaining seats if there is reservation stored to session storage', async () => {
  const registration = fakeRegistration({
    id: TEST_REGISTRATION_ID,
    maximum_attendee_capacity: 10,
    current_attendee_count: 3,
    remaining_attendee_capacity: 0,
  });
  const reservation = getMockedSeatsReservationData(1000);
  setSessionStorageValues(reservation, registration);
  renderComponent(registration);

  screen.getByText('Saatavilla olevia paikkoja');
  await screen.findByText(reservation.seats);
});

test('should show amount of free waiting list seats', async () => {
  renderComponent(
    fakeRegistration({
      maximum_attendee_capacity: 10,
      current_attendee_count: 10,
      current_waiting_list_count: 3,
      remaining_attendee_capacity: 0,
      remaining_waiting_list_capacity: 7,
      waiting_list_capacity: 10,
    })
  );

  screen.getByText('Saatavilla olevia jonopaikkoja');
  await screen.findByText('7');
});

test('should show amount of remaining waiting list seats ', async () => {
  renderComponent(
    fakeRegistration({
      maximum_attendee_capacity: 10,
      current_attendee_count: 10,
      current_waiting_list_count: 3,
      remaining_attendee_capacity: 0,
      remaining_waiting_list_capacity: 0,
      waiting_list_capacity: 10,
    })
  );

  screen.getByText('Saatavilla olevia jonopaikkoja');
  await screen.findByText('0');
});

test('should show amount of remaining waiting list seats if there is reservation stored to session storage', async () => {
  const registration = fakeRegistration({
    id: TEST_REGISTRATION_ID,
    maximum_attendee_capacity: 10,
    current_attendee_count: 10,
    current_waiting_list_count: 3,
    remaining_attendee_capacity: 0,
    remaining_waiting_list_capacity: 0,
    waiting_list_capacity: 10,
  });
  const reservation = getMockedSeatsReservationData(1000);
  setSessionStorageValues(reservation, registration);
  renderComponent(registration);

  screen.getByText('Saatavilla olevia jonopaikkoja');
  await screen.findByText(reservation.seats);
});
