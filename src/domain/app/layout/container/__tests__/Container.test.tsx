import { render } from '@testing-library/react';
import React from 'react';

import Container from '../Container';

test('should match snapshot', () => {
  const { container } = render(<Container>Content</Container>);
  expect(container.innerHTML).toMatchSnapshot();
});
