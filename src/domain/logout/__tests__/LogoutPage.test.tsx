import React from 'react';

import { configure, render, screen } from '../../../utils/testUtils';
import LogoutPage from '../LogoutPage';

configure({ defaultHidden: true });

const renderComponent = () => render(<LogoutPage />);

test('should render logout page', () => {
  renderComponent();

  screen.getByText('Olet kirjautunut ulos palvelusta.');
});
