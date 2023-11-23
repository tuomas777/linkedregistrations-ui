import React from 'react';

import {
  shouldRenderErrorPageTexts,
  shouldSignOut,
} from '../../../common/components/errorPageWithLogoutButton/testUtils';
import { ExtendedSession } from '../../../types';
import { configure, render } from '../../../utils/testUtils';
import InsufficientPermissions from '../InsufficientPermissions';

configure({ defaultHidden: true });

const renderComponent = (session?: ExtendedSession) =>
  render(<InsufficientPermissions />, { session });

test('should render insufficient permissions page', () => {
  renderComponent();
  shouldRenderErrorPageTexts({
    text: 'Sinulla ei ole oikeuksia tämän sisällön näkemiseen. Kirjaudu ulos ja kokeile toisella käyttäjätunnuksella.',
    title: 'Riittämättömät käyttöoikeudet',
  });
});

test('should start signOut process', async () => {
  renderComponent();
  await shouldSignOut();
});
