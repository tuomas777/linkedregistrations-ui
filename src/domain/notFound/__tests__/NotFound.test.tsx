import React from 'react';

import { render, screen } from '../../../utils/testUtils';
import NotFound from '../NotFound';

const renderComponent = () => render(<NotFound />);

test('should render not found page', () => {
  renderComponent();

  expect(
    screen.getByRole('heading', {
      name: 'Valitettavasti etsimääsi sivua ei löydy',
    })
  ).toBeInTheDocument();

  expect(
    screen.getByText(
      'Hakemaasi sivua ei löytynyt. Yritä myöhemmin uudelleen. Jos ongelma jatkuu, ota meihin yhteyttä.'
    )
  ).toBeInTheDocument();
});
