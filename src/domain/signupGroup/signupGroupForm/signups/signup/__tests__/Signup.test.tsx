import { Formik } from 'formik';
import React from 'react';

import {
  fakeLocalisedObject,
  fakePriceGroupDense,
  fakeRegistration,
  fakeRegistrationPriceGroup,
} from '../../../../../../utils/mockDataUtils';
import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
} from '../../../../../../utils/testUtils';
import { SIGNUP_INITIAL_VALUES } from '../../../../constants';
import { SignupGroupFormProvider } from '../../../../signupGroupFormContext/SignupGroupFormContext';
import Signup, { SignupProps } from '../Signup';

configure({ defaultHidden: true });

const TEST_REGISTRATION_PRICE_GROUP_ID = 1;
const registration = fakeRegistration();
const registrationWithPriceGroup = fakeRegistration({
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
  formDisabled: false,
  index: 0,
  isEditingMode: false,
  onDelete: jest.fn(),
  registration,
  showDelete: false,
  signup: SIGNUP_INITIAL_VALUES,
  signupPath: 'signup[0]',
};

const renderComponent = (props?: Partial<SignupProps>) =>
  render(
    <Formik initialValues={{}} onSubmit={jest.fn()}>
      <SignupGroupFormProvider registration={registration}>
        <Signup {...defaultProps} {...props} />
      </SignupGroupFormProvider>
    </Formik>
  );

test('should use default name in accordion label', async () => {
  renderComponent();
  await loadingSpinnerIsNotInDocument();

  expect(
    screen.getByRole('region', { name: 'Osallistuja 1' })
  ).toBeInTheDocument();
});

test('should shown name in accordion label', async () => {
  renderComponent({
    signup: { ...SIGNUP_INITIAL_VALUES, firstName: 'First', lastName: 'Last' },
  });
  await loadingSpinnerIsNotInDocument();

  expect(
    screen.getByRole('region', { name: 'First Last' })
  ).toBeInTheDocument();
});

test('should show price group name in the accordion label', async () => {
  renderComponent({
    registration: registrationWithPriceGroup,
    signup: {
      ...SIGNUP_INITIAL_VALUES,
      priceGroup: TEST_REGISTRATION_PRICE_GROUP_ID.toString(),
    },
  });
  await loadingSpinnerIsNotInDocument();

  expect(
    screen.getByRole('region', {
      name: 'Osallistuja 1 — Price group 1 10,00 €',
    })
  ).toBeInTheDocument();
});

test('price group button should be disabled in editing mode', async () => {
  renderComponent({
    isEditingMode: true,
    registration: registrationWithPriceGroup,
    signup: {
      ...SIGNUP_INITIAL_VALUES,
      priceGroup: TEST_REGISTRATION_PRICE_GROUP_ID.toString(),
    },
  });
  await loadingSpinnerIsNotInDocument();

  expect(screen.getByRole('button', { name: 'Asiakasryhmä *' })).toBeDisabled();
});
