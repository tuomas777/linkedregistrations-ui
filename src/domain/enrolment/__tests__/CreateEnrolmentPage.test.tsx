/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
import subYears from 'date-fns/subYears';
import { axe } from 'jest-axe';
import { rest } from 'msw';
import mockRouter from 'next-router-mock';
import singletonRouter from 'next/router';
import React from 'react';

import formatDate from '../../../utils/formatDate';
import { fakeEnrolment } from '../../../utils/mockDataUtils';
import {
  configure,
  render,
  screen,
  setQueryMocks,
  userEvent,
  waitFor,
} from '../../../utils/testUtils';
import { event } from '../../event/__mocks__/event';
import { TEST_EVENT_ID } from '../../event/constants';
import { languagesResponse } from '../../language/__mocks__/languages';
import { place } from '../../place/__mocks__/place';
import { TEST_PLACE_ID } from '../../place/constants';
import { registration } from '../../registration/__mocks__/registration';
import { TEST_REGISTRATION_ID } from '../../registration/constants';
import CreateEnrolmentPage from '../CreateEnrolmentPage';
import { ROUTES } from '../../app/routes/constants';

configure({ defaultHidden: true });

jest.mock('next/dist/client/router', () => require('next-router-mock'));

const enrolmentValues = {
  city: 'City',
  dateOfBirth: formatDate(subYears(new Date(), 9)),
  email: 'participant@email.com',
  name: 'Participan name',
  phoneNumber: '+358 44 123 4567',
  streetAddress: 'Street address',
  zip: '00100',
};

const enrolment = fakeEnrolment();

const findElement = (key: 'nameInput') => {
  switch (key) {
    case 'nameInput':
      return screen.findByRole('textbox', { name: /nimi/i });
  }
};

const getElement = (
  key:
    | 'acceptCheckbox'
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
    | 'submitButton'
    | 'zipInput'
) => {
  switch (key) {
    case 'acceptCheckbox':
      return screen.getByRole('checkbox', {
        name: /hyväksyn tietojeni jakamisen järjestäjän kanssa/i,
      });
    case 'cityInput':
      return screen.getByRole('textbox', { name: /kaupunki/i });
    case 'dateOfBirthInput':
      return screen.getByRole('textbox', { name: /syntymäaika/i });
    case 'emailCheckbox':
      return screen.getByRole('checkbox', { name: /sähköpostilla/i });
    case 'emailInput':
      return screen.getByRole('textbox', { name: /sähköpostiosoite/i });
    case 'nameInput':
      return screen.getByRole('textbox', { name: /nimi/i });
    case 'nativeLanguageButton':
      return screen.getByRole('button', { name: /äidinkieli/i });
    case 'phoneCheckbox':
      return screen.getByRole('checkbox', { name: /tekstiviestillä/i });
    case 'phoneInput':
      return screen.getByRole('textbox', { name: /puhelinnumero/i });
    case 'serviceLanguageButton':
      return screen.getByRole('button', { name: /asiointikieli/i });
    case 'streetAddressInput':
      return screen.getByRole('textbox', { name: /katuosoite/i });
    case 'submitButton':
      return screen.getByRole('button', { name: /lähetä ilmoittautuminen/i });
    case 'zipInput':
      return screen.getByRole('textbox', { name: /postinumero/i });
  }
};

const renderComponent = () => render(<CreateEnrolmentPage />);

const defaultMocks = [
  rest.get(`*/event/${TEST_EVENT_ID}/`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(event))
  ),
  rest.get(`*/place/${TEST_PLACE_ID}/`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(place))
  ),
  rest.get('*/language/', (req, res, ctx) =>
    res(ctx.status(200), ctx.json(languagesResponse))
  ),
  rest.get(`*/registration/${TEST_REGISTRATION_ID}/`, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(registration))
  ),
];

test.skip('page is accessible', async () => {
  setQueryMocks(...defaultMocks);
  singletonRouter.push({
    pathname: ROUTES.CREATE_ENROLMENT,
    query: { registrationId: TEST_REGISTRATION_ID },
  });
  const { container } = renderComponent();

  await findElement('nameInput');
  expect(await axe(container)).toHaveNoViolations();
});

test('should validate enrolment form and focus invalid field', async () => {
  const user = userEvent.setup();

  setQueryMocks(
    ...defaultMocks,
    rest.post(`*/signup/`, (req, res, ctx) =>
      res(ctx.status(201), ctx.json(enrolment))
    )
  );
  singletonRouter.push({
    pathname: ROUTES.CREATE_ENROLMENT,
    query: { registrationId: TEST_REGISTRATION_ID },
  });
  renderComponent();

  const nameInput = await findElement('nameInput');
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
  const acceptCheckbox = getElement('acceptCheckbox');
  const submitButton = getElement('submitButton');

  expect(nameInput).not.toHaveFocus();

  await user.click(submitButton);
  await waitFor(() => expect(nameInput).toHaveFocus());

  await user.type(nameInput, enrolmentValues.name);
  await user.click(submitButton);
  await waitFor(() => expect(streetAddressInput).toHaveFocus());

  await user.type(streetAddressInput, enrolmentValues.streetAddress);
  await user.click(submitButton);
  await waitFor(() => expect(dateOfBirthInput).toHaveFocus());

  await user.type(dateOfBirthInput, formatDate(subYears(new Date(), 20)));
  await user.click(submitButton);
  await waitFor(() => expect(dateOfBirthInput).toHaveFocus());

  await user.clear(dateOfBirthInput);
  await user.type(dateOfBirthInput, formatDate(subYears(new Date(), 7)));
  await user.click(submitButton);
  await waitFor(() => expect(dateOfBirthInput).toHaveFocus());

  await user.clear(dateOfBirthInput);
  await user.type(dateOfBirthInput, enrolmentValues.dateOfBirth);
  await user.click(submitButton);
  await waitFor(() => expect(zipInput).toHaveFocus());

  await user.type(zipInput, enrolmentValues.zip);
  await user.click(submitButton);
  await waitFor(() => expect(cityInput).toHaveFocus());

  await user.type(cityInput, enrolmentValues.city);
  await user.click(submitButton);
  await waitFor(() => expect(emailCheckbox).toHaveFocus());

  expect(emailInput).not.toBeRequired();
  await user.click(emailCheckbox);
  await user.click(submitButton);
  await waitFor(() => expect(emailInput).toHaveFocus());
  expect(emailInput).toBeRequired();

  expect(phoneInput).not.toBeRequired();
  await user.type(emailInput, enrolmentValues.email);
  await user.click(phoneCheckbox);
  await user.click(submitButton);
  await waitFor(() => expect(phoneInput).toHaveFocus());
  expect(phoneInput).toBeRequired();

  await user.type(phoneInput, enrolmentValues.phoneNumber);
  await user.click(submitButton);
  await waitFor(() => expect(nativeLanguageButton).toHaveFocus());

  await user.click(nativeLanguageButton);
  const nativeLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  await user.click(nativeLanguageOption);
  await user.click(submitButton);
  await waitFor(() => expect(serviceLanguageButton).toHaveFocus());

  await user.click(serviceLanguageButton);
  const serviceLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  await user.click(serviceLanguageOption);
  await user.click(submitButton);
  await waitFor(() => expect(acceptCheckbox).toHaveFocus());

  await user.click(acceptCheckbox);
  await user.click(submitButton);
  await waitFor(() =>
    expect(mockRouter.asPath).toBe(
      `/fi/registration/${registration.id}/enrolment/${enrolment.cancellation_code}/completed`
    )
  );
});

test('should show server errors', async () => {
  const user = userEvent.setup();
  setQueryMocks(
    ...defaultMocks,
    rest.post(`*/signup/`, (req, res, ctx) =>
      res(
        ctx.status(400),
        ctx.json({
          city: ['Tämän kentän arvo ei voi olla "null".'],
          detail: 'The participant is too old.',
          name: ['Tämän kentän arvo ei voi olla "null".'],
          non_field_errors: [
            'Kenttien email, registration tulee muodostaa uniikki joukko.',
            'Kenttien phone_number, registration tulee muodostaa uniikki joukko.',
          ],
        })
      )
    )
  );
  singletonRouter.push({
    pathname: ROUTES.CREATE_ENROLMENT,
    query: { registrationId: TEST_REGISTRATION_ID },
  });
  renderComponent();

  const nameInput = await findElement('nameInput');
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
  const acceptCheckbox = getElement('acceptCheckbox');
  const submitButton = getElement('submitButton');

  await user.type(nameInput, enrolmentValues.name);
  await user.type(streetAddressInput, enrolmentValues.streetAddress);
  await user.type(dateOfBirthInput, enrolmentValues.dateOfBirth);
  await user.type(zipInput, enrolmentValues.zip);
  await user.type(cityInput, enrolmentValues.city);

  await user.click(emailCheckbox);
  await user.type(emailInput, enrolmentValues.email);
  await user.click(phoneCheckbox);
  await user.type(phoneInput, enrolmentValues.phoneNumber);
  await user.click(submitButton);
  await waitFor(() => expect(nativeLanguageButton).toHaveFocus());

  await user.click(nativeLanguageButton);
  const nativeLanguageOption = await screen.findByRole(
    'option',
    { name: /suomi/i },
    { timeout: 30000 }
  );
  await user.click(nativeLanguageOption);

  await user.click(serviceLanguageButton);
  const serviceLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  await user.click(serviceLanguageOption);

  await user.click(acceptCheckbox);
  await user.click(submitButton);

  await screen.findByText(/lomakkeella on seuraavat virheet/i);
});

test('should show not found page if registration does not exist', async () => {
  setQueryMocks(
    rest.get(`*/registration/not-found/`, (req, res, ctx) =>
      res(ctx.status(404), ctx.json({ errorMessage: 'Not found' }))
    )
  );

  singletonRouter.push({
    pathname: ROUTES.CREATE_ENROLMENT,
    query: { registrationId: 'not-found' },
  });
  renderComponent();

  await screen.findByRole('heading', {
    name: 'Valitettavasti etsimääsi sivua ei löydy',
  });

  screen.getByText(
    'Hakemaasi sivua ei löytynyt. Yritä myöhemmin uudelleen. Jos ongelma jatkuu, ota meihin yhteyttä.'
  );
});
