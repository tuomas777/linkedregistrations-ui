/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { axe } from 'jest-axe';
import { rest } from 'msw';
import * as nextAuth from 'next-auth/react';
import mockRouter from 'next-router-mock';
import singletonRouter from 'next/router';
import React from 'react';

import { ExtendedSession } from '../../../types';
import { fakeAuthenticatedSession } from '../../../utils/mockSession';
import {
  actWait,
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
import { signupGroup } from '../__mocks__/signupGroup';
import { TEST_SIGNUP_GROUP_ID } from '../constants';
import EditSignupGroupPage from '../EditSignupGroupPage';

configure({ defaultHidden: true });

jest.mock('next/dist/client/router', () => require('next-router-mock'));

export const findFirstNameInput = () => {
  return screen.findByRole('textbox', { name: /etunimi/i });
};

export const getSignupFormElement = (
  key:
    | 'acceptCheckbox'
    | 'cancelButton'
    | 'cityInput'
    | 'dateOfBirthInput'
    | 'emailCheckbox'
    | 'emailInput'
    | 'firstNameInput'
    | 'lastNameInput'
    | 'nativeLanguageButton'
    | 'participantAmountInput'
    | 'phoneCheckbox'
    | 'phoneInput'
    | 'serviceLanguageButton'
    | 'streetAddressInput'
    | 'submitButton'
    | 'updateParticipantAmountButton'
    | 'zipInput'
) => {
  switch (key) {
    case 'acceptCheckbox':
      return screen.getByLabelText(
        /hyväksyn tietojeni jakamisen järjestäjän kanssa/i
      );
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
    case 'firstNameInput':
      return screen.getByLabelText(/etunimi/i);
    case 'lastNameInput':
      return screen.getByLabelText(/sukunimi/i);
    case 'nativeLanguageButton':
      return screen.getByRole('button', { name: /äidinkieli/i });
    case 'participantAmountInput':
      return screen.getByRole('spinbutton', {
        name: /ilmoittautujien määrä \*/i,
      });
    case 'phoneCheckbox':
      return screen.getByLabelText(/tekstiviestillä/i);
    case 'phoneInput':
      return screen.getByLabelText(/puhelinnumero/i);
    case 'serviceLanguageButton':
      return screen.getByRole('button', { name: /asiointikieli/i });
    case 'streetAddressInput':
      return screen.getByLabelText(/katuosoite/i);
    case 'submitButton':
      return screen.getByRole('button', { name: /jatka ilmoittautumiseen/i });
    case 'updateParticipantAmountButton':
      return screen.getByRole('button', { name: /päivitä/i });
    case 'zipInput':
      return screen.getByLabelText(/postinumero/i);
  }
};

const defaultSession = fakeAuthenticatedSession();
const renderComponent = (session: ExtendedSession | null = defaultSession) =>
  render(<EditSignupGroupPage />, { session });

// Mock getSession return value
(nextAuth as any).getSession = jest.fn().mockReturnValue(defaultSession);

test.skip('page is accessible', async () => {
  const { container } = renderComponent();

  await findFirstNameInput();
  expect(await axe(container)).toHaveNoViolations();
});

const defaultMocks = [
  ...mockedLanguagesResponses,
  rest.get(`*/registration/${TEST_REGISTRATION_ID}/`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(registration))
  ),
  rest.get(`*/signup_group/*`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(signupGroup))
  ),
];

const pushEditSignupGroupRoute = (registrationId: string) => {
  singletonRouter.push({
    pathname: ROUTES.EDIT_SIGNUP,
    query: {
      registrationId: registrationId,
      signupId: TEST_SIGNUP_GROUP_ID,
    },
  });
};

export const tryToCancel = async () => {
  const user = userEvent.setup();
  const cancelButton = getSignupFormElement('cancelButton');
  await user.click(cancelButton);

  const modal = await screen.findByRole('dialog', {
    name: 'Haluatko varmasti poistaa ilmoittautumisen?',
  });
  const withinModal = within(modal);
  const cancelSignupButton = withinModal.getByRole('button', {
    name: 'Peruuta ilmoittautuminen',
  });
  await user.click(cancelSignupButton);
};

export const shouldRenderSignupFormFields = async () => {
  const firstNameInput = await findFirstNameInput();
  const lastNameInput = getSignupFormElement('lastNameInput');
  const streetAddressInput = getSignupFormElement('streetAddressInput');
  const dateOfBirthInput = getSignupFormElement('dateOfBirthInput');
  const zipInput = getSignupFormElement('zipInput');
  const cityInput = getSignupFormElement('cityInput');
  const emailInput = getSignupFormElement('emailInput');
  const phoneInput = getSignupFormElement('phoneInput');
  const emailCheckbox = getSignupFormElement('emailCheckbox');
  const phoneCheckbox = getSignupFormElement('phoneCheckbox');
  const nativeLanguageButton = getSignupFormElement('nativeLanguageButton');
  const serviceLanguageButton = getSignupFormElement('serviceLanguageButton');
  getSignupFormElement('cancelButton');

  expect(firstNameInput.hasAttribute('readonly')).toBeTruthy();
  expect(lastNameInput.hasAttribute('readonly')).toBeTruthy();
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
};

test('should render signup group edit page field', async () => {
  setQueryMocks(...defaultMocks);
  pushEditSignupGroupRoute(TEST_REGISTRATION_ID);
  renderComponent();

  await actWait(100);
  await shouldRenderSignupFormFields();
});

test('should cancel signup group', async () => {
  setQueryMocks(
    ...defaultMocks,
    rest.delete(`*/signup_group/${TEST_SIGNUP_GROUP_ID}`, (req, res, ctx) =>
      res(ctx.status(201), ctx.json(null))
    )
  );
  pushEditSignupGroupRoute(TEST_REGISTRATION_ID);
  renderComponent();

  await findFirstNameInput();
  await tryToCancel();

  await waitFor(() =>
    expect(mockRouter.asPath).toBe(
      `/fi/registration/${TEST_REGISTRATION_ID}/signup-group/cancelled`
    )
  );
});

test('should show error message when cancelling signup group fails', async () => {
  setQueryMocks(
    ...defaultMocks,
    rest.delete(`*/signup_group/${TEST_SIGNUP_GROUP_ID}`, (req, res, ctx) =>
      res(ctx.status(403), ctx.json({ detail: 'Malformed UUID.' }))
    )
  );
  pushEditSignupGroupRoute(TEST_REGISTRATION_ID);
  renderComponent();

  await findFirstNameInput();
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
    rest.get(`*/signup_group/*`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(signupGroup))
    )
  );
  pushEditSignupGroupRoute('not-found');
  renderComponent();

  await loadingSpinnerIsNotInDocument();

  await screen.findByRole('heading', {
    name: 'Valitettavasti etsimääsi sivua ei löydy',
  });

  screen.getByText(
    'Hakemaasi sivua ei löytynyt. Yritä myöhemmin uudelleen. Jos ongelma jatkuu, ota meihin yhteyttä.'
  );
});

test('should show authentication required page if user is not authenticated', async () => {
  setQueryMocks(...defaultMocks);
  pushEditSignupGroupRoute(TEST_REGISTRATION_ID);
  renderComponent(null);

  await loadingSpinnerIsNotInDocument();

  await screen.findByRole('heading', { name: 'Kirjautuminen vaaditaan' });

  screen.getByText(
    'Sinun tulee olla kirjautunut tarkastellaksesi ilmoittautumisen tietoja.'
  );
});
