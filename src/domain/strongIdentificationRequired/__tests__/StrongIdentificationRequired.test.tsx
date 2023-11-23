/* eslint-disable max-len */
import React from 'react';

import {
  shouldRenderErrorPageTexts,
  shouldSignOut,
} from '../../../common/components/errorPageWithLogoutButton/testUtils';
import { ExtendedSession } from '../../../types';
import { configure, render } from '../../../utils/testUtils';
import StrongIdentificationRequired from '../StrongIdentificationRequired';

configure({ defaultHidden: true });

const renderComponent = (session?: ExtendedSession) =>
  render(<StrongIdentificationRequired />, { session });

test('should render strong identification required page', () => {
  renderComponent();

  shouldRenderErrorPageTexts({
    text: 'Tämän sisällön näkeminen edellyttää vahvaa tunnistautumista. Kirjaudu ulos ja kokeile toista kirjautumistapaa.',
    title: 'Vahva tunnistautuminen vaaditaan',
  });
});

test('should start signOut process', async () => {
  renderComponent();
  await shouldSignOut();
});
