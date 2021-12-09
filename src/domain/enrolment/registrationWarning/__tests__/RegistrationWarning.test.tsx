import addDays from 'date-fns/addDays';
import subDays from 'date-fns/subDays';
import React from 'react';

import { fakeRegistration } from '../../../../utils/mockDataUtils';
import { render, screen } from '../../../../utils/testUtils';
import { Registration } from '../../../registration/types';
import RegistrationWarning from '../RegistrationWarning';

const renderComponent = (registration: Registration) =>
  render(<RegistrationWarning registration={registration} />);

test('should show warning if registration is full', async () => {
  const now = new Date();
  const enrolment_start_time = subDays(now, 1).toISOString();
  const enrolment_end_time = addDays(now, 1).toISOString();
  const registration = fakeRegistration({
    current_attendee_count: 10,
    current_waiting_list_count: 5,
    enrolment_end_time,
    enrolment_start_time,
    maximum_attendee_capacity: 10,
    waiting_list_capacity: 5,
  });

  renderComponent(registration);

  screen.getByText(
    'Ilmoittautuminen tähän tapahtumaan on tällä hetkellä suljettu. Kokeile myöhemmin uudelleen.'
  );
});
