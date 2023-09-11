import React from 'react';

import { configure, render, screen } from '../../../../../../utils/testUtils';
import { SIGNUP_INITIAL_VALUES } from '../../../../constants';
import Signup, { SignupProps } from '../Signup';

configure({ defaultHidden: true });

const signup = SIGNUP_INITIAL_VALUES;

const defaultProps: SignupProps = {
  signup,
  signupPath: '',
};

const renderComponent = (props?: Partial<SignupProps>) =>
  render(<Signup {...defaultProps} {...props} />);

test('should not show in waiting list text if signup is not in waiting list', async () => {
  renderComponent({ signup: { ...signup, inWaitingList: false } });

  expect(screen.queryByText('Varasija')).not.toBeInTheDocument();
});

test('should show in waiting list text if signup is in waiting list', async () => {
  renderComponent({ signup: { ...signup, inWaitingList: true } });

  screen.getByText('Varasija');
});
