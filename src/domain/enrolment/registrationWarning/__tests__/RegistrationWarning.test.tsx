import React from 'react';

import { fakeRegistration } from '../../../../utils/mockDataUtils';
import { render, screen } from '../../../../utils/testUtils';
import { Registration } from '../../../registration/types';
import RegistrationWarning from '../RegistrationWarning';

const renderComponent = (registration: Registration) =>
  render(<RegistrationWarning registration={registration} />);

test('should show warning if registration is full', async () => {
  const registration = fakeRegistration({
    current_attendee_count: 10,
    maximum_attendee_capacity: 10,
    waiting_list_capacity: 5,
    current_waiting_list_count: 5,
  });

  renderComponent(registration);

  screen.getByText(
    'Ilmoittautuminen tähän tapahtumaan on tällä hetkellä suljettu. Kokeile myöhemmin uudelleen.'
  );
});
