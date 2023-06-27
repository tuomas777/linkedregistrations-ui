/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { axe } from 'jest-axe';
import { rest } from 'msw';
import mockRouter from 'next-router-mock';
import singletonRouter from 'next/router';
import React from 'react';

import {
  configure,
  loadingSpinnerIsNotInDocument,
  render,
  screen,
  setQueryMocks,
  userEvent,
  waitFor,
  within,
} from '../../../utils/testUtils';
import { ROUTES } from '../../app/routes/constants';
import { mockedLanguagesResponses } from '../../language/__mocks__/languages';
import { registration } from '../../registration/__mocks__/registration';
import { TEST_REGISTRATION_ID } from '../../registration/constants';
import { enrolment } from '../__mocks__/enrolment';
import {
  TEST_ENROLMENT_CANCELLATION_CODE,
  TEST_ENROLMENT_ID,
} from '../constants';
import EditEnrolmentPage from '../EditEnrolmentPage';

configure({ defaultHidden: true });

jest.mock('next/dist/client/router', () => require('next-router-mock'));

const findNameInput = () => {
  return screen.findByRole('textbox', { name: /nimi/i });
};

const getElement = (
  key:
    | 'cancelButton'
    | 'cityInput'
    | 'dateOfBirthInput'
    | 'emailCheckbox'
    | 'emailInput'
    | 'nameInput'
    | 'nativeLanguageButton'
    | 'phoneCheckbox'
    | 'phoneInput'
    | 'serviceLanguageButton'
    | 'streetAddressInput'
    | 'zipInput'
) => {
  switch (key) {
    case 'cancelButton':
      return screen.getByRole('button', { name: /peruuta ilmoittautuminen/i });
    case 'cityInput':
      return screen.getByLabelText(/kaupunki/i);
    case 'dateOfBirthInput':
      return screen.getByLabelText(/syntymäaika/i);
    case 'emailCheckbox':
      return screen.getByLabelText(/sähköpostilla/i);
    case 'emailInput':
      return screen.getByLabelText(/sähköpostiosoite/i);
    case 'nameInput':
      return screen.getByLabelText(/nimi/i);
    case 'nativeLanguageButton':
      return screen.getByRole('button', { name: /äidinkieli/i });
    case 'phoneCheckbox':
      return screen.getByLabelText(/tekstiviestillä/i);
    case 'phoneInput':
      return screen.getByLabelText(/puhelinnumero/i);
    case 'serviceLanguageButton':
      return screen.getByRole('button', { name: /asiointikieli/i });
    case 'streetAddressInput':
      return screen.getByLabelText(/katuosoite/i);
    case 'zipInput':
      return screen.getByLabelText(/postinumero/i);
  }
};

const renderComponent = () => render(<EditEnrolmentPage />);

test.skip('page is accessible', async () => {
  const { container } = renderComponent();

  await findNameInput();
  expect(await axe(container)).toHaveNoViolations();
});

const defaultMocks = [
  ...mockedLanguagesResponses,
  rest.get(`*/registration/${TEST_REGISTRATION_ID}/`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(registration))
  ),
  rest.get(`*/signup/*`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(enrolment))
  ),
];

const pushEditEnrolmentRoute = (registrationId: string) => {
  singletonRouter.push({
    pathname: ROUTES.EDIT_ENROLMENT,
    query: {
      accessCode: TEST_ENROLMENT_CANCELLATION_CODE,
      enrolmentId: TEST_ENROLMENT_ID,
      registrationId: registrationId,
    },
  });
};

const tryToCancel = async () => {
  const user = userEvent.setup();
  const cancelButton = getElement('cancelButton');
  await user.click(cancelButton);

  const modal = await screen.findByRole('dialog', {
    name: 'Haluatko varmasti poistaa ilmoittautumisen?',
  });
  const withinModal = within(modal);
  const cancelEnrolmentButton = withinModal.getByRole('button', {
    name: 'Peruuta ilmoittautuminen',
  });
  await user.click(cancelEnrolmentButton);
};

test('should edit enrolment page field', async () => {
  setQueryMocks(...defaultMocks);
  pushEditEnrolmentRoute(TEST_REGISTRATION_ID);
  renderComponent();

  const nameInput = await findNameInput();
  const streetAddressInput = getElement('streetAddressInput');
  const dateOfBirthInput = getElement('dateOfBirthInput');
  const zipInput = getElement('zipInput');
  const cityInput = getElement('cityInput');
  const emailInput = getElement('emailInput');
  const phoneInput = getElement('phoneInput');
  const emailCheckbox = getElement('emailCheckbox');
  const phoneCheckbox = getElement('phoneCheckbox');
  const nativeLanguageButton = getElement('nativeLanguageButton');
  const serviceLanguageButton = getElement('serviceLanguageButton');
  getElement('cancelButton');

  expect(nameInput.hasAttribute('readonly')).toBeTruthy();
  expect(streetAddressInput.hasAttribute('readonly')).toBeTruthy();
  expect(dateOfBirthInput.hasAttribute('readonly')).toBeTruthy();
  expect(zipInput.hasAttribute('readonly')).toBeTruthy();
  expect(cityInput.hasAttribute('readonly')).toBeTruthy();
  expect(emailInput.hasAttribute('readonly')).toBeTruthy();
  expect(phoneInput.hasAttribute('readonly')).toBeTruthy();
  expect(emailCheckbox).toBeDisabled();
  expect(phoneCheckbox).toBeDisabled();
  expect(nativeLanguageButton).toBeDisabled();
  expect(serviceLanguageButton).toBeDisabled();
});

test('should cancel enrolment', async () => {
  setQueryMocks(
    ...defaultMocks,
    rest.delete(`*/signup/${TEST_ENROLMENT_ID}`, (req, res, ctx) =>
      res(ctx.status(201), ctx.json(null))
    )
  );
  pushEditEnrolmentRoute(TEST_REGISTRATION_ID);
  renderComponent();

  await findNameInput();
  await tryToCancel();

  await waitFor(() =>
    expect(mockRouter.asPath).toBe(
      `/fi/registration/${TEST_REGISTRATION_ID}/enrolment/cancelled`
    )
  );
});

test('should show error message when cancelling enrolment fails', async () => {
  setQueryMocks(
    ...defaultMocks,
    rest.delete(`*/signup/${TEST_ENROLMENT_ID}`, (req, res, ctx) =>
      res(ctx.status(403), ctx.json({ detail: 'Malformed UUID.' }))
    )
  );
  pushEditEnrolmentRoute(TEST_REGISTRATION_ID);
  renderComponent();

  await findNameInput();
  await tryToCancel();

  await screen.findByRole(
    'heading',
    { name: /lomakkeella on seuraavat virheet/i },
    { timeout: 10000 }
  );
});

test('should show not found page if registration does not exist', async () => {
  setQueryMocks(
    rest.get(`*/registration/not-found/`, (req, res, ctx) =>
      res(ctx.status(404), ctx.json({ errorMessage: 'Not found' }))
    ),
    rest.get(`*/signup/*`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(enrolment))
    )
  );
  pushEditEnrolmentRoute('not-found');
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  await screen.findByRole('heading', {
    name: 'Valitettavasti etsimääsi sivua ei löydy',
  });

  screen.getByText(
    'Hakemaasi sivua ei löytynyt. Yritä myöhemmin uudelleen. Jos ongelma jatkuu, ota meihin yhteyttä.'
  );
});
