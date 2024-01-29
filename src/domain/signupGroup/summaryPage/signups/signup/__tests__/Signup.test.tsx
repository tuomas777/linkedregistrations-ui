import React from 'react';

import {
  fakeLocalisedObject,
  fakePriceGroupDense,
  fakeRegistration,
  fakeRegistrationPriceGroup,
} from '../../../../../../utils/mockDataUtils';
import { configure, render, screen } from '../../../../../../utils/testUtils';
import { registrationOverrides } from '../../../../../registration/__mocks__/registration';
import { SIGNUP_INITIAL_VALUES } from '../../../../constants';
import {
  HIDE_NOT_MANDATORY_FIELD_CASES,
  shouldRenderSignupFields,
} from '../../../../testUtils';
import Signup, { SignupProps } from '../Signup';

configure({ defaultHidden: true });

const signup = SIGNUP_INITIAL_VALUES;
const TEST_REGISTRATION_PRICE_GROUP_ID = 1;
const registration = fakeRegistration(registrationOverrides);
const registrationWithPriceGroup = fakeRegistration({
  ...registrationOverrides,
  registration_price_groups: [
    fakeRegistrationPriceGroup({
      id: TEST_REGISTRATION_PRICE_GROUP_ID,
      price: '10.00',
      price_group: fakePriceGroupDense({
        description: fakeLocalisedObject('Price group 1'),
      }),
    }),
  ],
});

const defaultProps: SignupProps = {
  registration,
  signup,
  signupPath: '',
};

const renderComponent = (props?: Partial<SignupProps>) =>
  render(<Signup {...defaultProps} {...props} />);

test('should not show in waiting list text if signup is not in waiting list', async () => {
  renderComponent({ signup: { ...signup, inWaitingList: false } });

  expect(screen.queryByText('Jonopaikka')).not.toBeInTheDocument();
});

test('should show in waiting list text if signup is in waiting list', async () => {
  renderComponent({ signup: { ...signup, inWaitingList: true } });

  expect(screen.getByText('Jonopaikka')).toBeInTheDocument();
});

test('should show price group name in the title', async () => {
  renderComponent({
    registration: registrationWithPriceGroup,
    signup: {
      ...SIGNUP_INITIAL_VALUES,
      priceGroup: TEST_REGISTRATION_PRICE_GROUP_ID.toString(),
    },
  });

  expect(screen.getByText('Price group 1 10,00 €')).toBeInTheDocument();
});

test('should show price group name in the title', async () => {
  renderComponent({
    registration: registrationWithPriceGroup,
    signup: {
      ...SIGNUP_INITIAL_VALUES,
      priceGroup: TEST_REGISTRATION_PRICE_GROUP_ID.toString(),
      inWaitingList: true,
    },
  });

  expect(screen.getByText(/Price group 1 10,00 €/)).toBeInTheDocument();
  expect(screen.getByText('Jonopaikka')).toBeInTheDocument();
});

test('should display all mandatory fields', () => {
  renderComponent();
  shouldRenderSignupFields();
});

test.each(HIDE_NOT_MANDATORY_FIELD_CASES)(
  'should hide not mandatory field, %s',
  (mandatoryField, hiddenFieldLabel) => {
    renderComponent({
      registration: fakeRegistration({
        ...registrationOverrides,
        mandatory_fields: registrationOverrides.mandatory_fields.filter(
          (i) => i !== mandatoryField
        ),
      }),
    });
    expect(screen.queryByLabelText(hiddenFieldLabel)).not.toBeInTheDocument();
  }
);
