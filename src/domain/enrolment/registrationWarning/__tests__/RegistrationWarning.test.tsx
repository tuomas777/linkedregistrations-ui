import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import React from 'react';

import {
  fakeRegistration,
  getMockedSeatsReservationData,
  setSessionStorageValues,
} from '../../../../utils/mockDataUtils';
import { render, screen } from '../../../../utils/testUtils';
import { TEST_REGISTRATION_ID } from '../../../registration/constants';
import { Registration } from '../../../registration/types';
import RegistrationWarning from '../RegistrationWarning';

const renderComponent = (registration: Registration) =>
  render(<RegistrationWarning registration={registration} />);

const now = new Date();
const enrolment_start_time = subDays(now, 1).toISOString();
const enrolment_end_time = addDays(now, 1).toISOString();
const registration = fakeRegistration({
  current_attendee_count: 10,
  current_waiting_list_count: 5,
  enrolment_end_time,
  enrolment_start_time,
  id: TEST_REGISTRATION_ID,
  maximum_attendee_capacity: 10,
  waiting_list_capacity: 5,
});

test('should show warning if registration is full', async () => {
  renderComponent(registration);

  screen.getByText(
    'Tapahtuman kaikki paikat ovat tällä hetkellä varatut. Kokeile myöhemmin uudelleen.'
  );
});

test('should not show warning if registration is full but user has reservation', async () => {
  const reservation = getMockedSeatsReservationData(1000);
  setSessionStorageValues(reservation, registration);
  renderComponent(registration);

  expect(
    screen.queryByText(
      'Tapahtuman kaikki paikat ovat tällä hetkellä varatut. Kokeile myöhemmin uudelleen.'
    )
  ).not.toBeInTheDocument();
});
