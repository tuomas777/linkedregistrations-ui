import React from 'react';

import { render, screen } from '../../../../../utils/testUtils';
import { ENROLMENT_QUERY_PARAMS } from '../../../../enrolment/constants';
import PageLayout from '../PageLayout';

const renderComponent = (query?: { [ENROLMENT_QUERY_PARAMS.IFRAME]: string }) =>
  render(<PageLayout />, { query });

test('should show page header', async () => {
  renderComponent();

  screen.getByRole('banner');
});

test('should not show page header', async () => {
  renderComponent({ iframe: 'true' });

  expect(screen.queryByRole('banner')).not.toBeInTheDocument();
});
