import { IconCross } from 'hds-react';
import React from 'react';

import { render, screen } from '../../../../utils/testUtils';
import { testId } from '../../loadingSpinner/LoadingSpinner';
import LoadingButton, { LoadingButtonProps } from '../LoadingButton';

const defaultProps: LoadingButtonProps = {
  children: 'Button label',
  icon: <IconCross aria-hidden={true} />,
  loading: false,
  onClick: jest.fn(),
  type: 'button',
  variant: 'danger',
};

const renderComponent = (
  props?: Partial<Omit<LoadingButtonProps, 'variant'>>
) => render(<LoadingButton {...defaultProps} {...props} />);

test('should not show loading spinner', async () => {
  renderComponent();
  expect(screen.queryByTestId(testId)).not.toBeInTheDocument();
});

test('should show loading spinner', async () => {
  renderComponent({ loading: true });
  expect(screen.queryByTestId(testId)).toBeInTheDocument();
});
