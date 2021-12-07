/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @jest-environment jsdom
 */
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

test.skip('page is accessible', async () => {
  const { container } = renderComponent();

  await findElement('nameInput');
  expect(await axe(container)).toHaveNoViolations();
});

test('should validate enrolment form and focus invalid field', async () => {
  setQueryMocks(
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
    rest.post(`*/signup/`, (req, res, ctx) =>
      res(ctx.status(201), ctx.json(enrolment))
    )
  );
  singletonRouter.push({
    pathname: 'registration/[registrationId]/enrolment/create',
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

  userEvent.click(submitButton);
  await waitFor(() => expect(nameInput).toHaveFocus());

  userEvent.type(nameInput, enrolmentValues.name);
  userEvent.click(submitButton);
  await waitFor(() => expect(streetAddressInput).toHaveFocus());

  userEvent.type(streetAddressInput, enrolmentValues.streetAddress);
  userEvent.click(submitButton);
  await waitFor(() => expect(dateOfBirthInput).toHaveFocus());

  userEvent.type(dateOfBirthInput, enrolmentValues.dateOfBirth);
  userEvent.click(submitButton);
  await waitFor(() => expect(zipInput).toHaveFocus());

  userEvent.type(zipInput, enrolmentValues.zip);
  userEvent.click(submitButton);
  await waitFor(() => expect(cityInput).toHaveFocus());

  userEvent.type(cityInput, enrolmentValues.city);
  userEvent.click(submitButton);
  await waitFor(() => expect(emailCheckbox).toHaveFocus());

  expect(emailInput).not.toBeRequired();
  userEvent.click(emailCheckbox);
  userEvent.click(submitButton);
  await waitFor(() => expect(emailInput).toHaveFocus());
  expect(emailInput).toBeRequired();

  expect(phoneInput).not.toBeRequired();
  userEvent.type(emailInput, enrolmentValues.email);
  userEvent.click(phoneCheckbox);
  userEvent.click(submitButton);
  await waitFor(() => expect(phoneInput).toHaveFocus());
  expect(phoneInput).toBeRequired();

  userEvent.type(phoneInput, enrolmentValues.phoneNumber);
  userEvent.click(submitButton);
  await waitFor(() => expect(nativeLanguageButton).toHaveFocus());

  userEvent.click(nativeLanguageButton);
  const nativeLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  userEvent.click(nativeLanguageOption);
  userEvent.click(submitButton);
  await waitFor(() => expect(serviceLanguageButton).toHaveFocus());

  userEvent.click(serviceLanguageButton);
  const serviceLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  userEvent.click(serviceLanguageOption);
  userEvent.click(submitButton);
  await waitFor(() => expect(acceptCheckbox).toHaveFocus());

  userEvent.click(acceptCheckbox);
  userEvent.click(submitButton);
  await waitFor(() =>
    expect(mockRouter.asPath).toBe(
      `/fi/registration/1/enrolment/${enrolment.id}/completed/${enrolment.cancellation_code}`
    )
  );
});

test('should show not found page if registration does not exist', async () => {
  setQueryMocks(
    rest.get(`*/registration/not-found/`, (req, res, ctx) =>
      res(ctx.status(404), ctx.json({ errorMessage: 'Not found' }))
    )
  );

  singletonRouter.push({
    pathname: 'registration/[registrationId]/enrolment/create',
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
