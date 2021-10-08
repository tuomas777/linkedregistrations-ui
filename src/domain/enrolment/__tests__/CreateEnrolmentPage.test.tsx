/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @jest-environment jsdom
 */
import { axe } from 'jest-axe';
import { rest } from 'msw';
import React from 'react';
import { toast } from 'react-toastify';

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
import CreateEnrolmentPage from '../CreateEnrolmentPage';

configure({ defaultHidden: true });

const enrolmentValues = {
  city: 'City',
  email: 'participant@email.com',
  name: 'Participan name',
  phone: '+358 44 123 4567',
  streetAddress: 'Street address',
  zip: '00100',
};

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
    | 'emailCheckbox'
    | 'emailInput'
    | 'nameInput'
    | 'nativeLanguageButton'
    | 'notificationLanguageButton'
    | 'phoneCheckbox'
    | 'phoneInput'
    | 'serviceLanguageButton'
    | 'streetAddressInput'
    | 'submitButton'
    | 'yearOfBirthButton'
    | 'zipInput'
) => {
  switch (key) {
    case 'acceptCheckbox':
      return screen.getByRole('checkbox', {
        name: /hyväksyn tietojeni jakamisen järjestäjän kanssa/i,
      });
    case 'cityInput':
      return screen.getByRole('textbox', { name: /kaupunki/i });
    case 'emailCheckbox':
      return screen.getByRole('checkbox', { name: /sähköpostilla/i });
    case 'emailInput':
      return screen.getByRole('textbox', { name: /sähköpostiosoite/i });
    case 'nameInput':
      return screen.getByRole('textbox', { name: /nimi/i });
    case 'nativeLanguageButton':
      return screen.getByRole('button', { name: /äidinkieli/i });
    case 'notificationLanguageButton':
      return screen.getByRole('button', { name: /ilmoitusten kieli/i });
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
    case 'yearOfBirthButton':
      return screen.getByRole('button', { name: /syntymävuosi/i });
    case 'zipInput':
      return screen.getByRole('textbox', { name: /postinumero/i });
  }
};

beforeEach(() => {
  setQueryMocks(
    ...[
      rest.get(`*/event/${TEST_EVENT_ID}/`, (req, res, ctx) =>
        res(ctx.status(200), ctx.json(event))
      ),
      rest.get(`*/place/${TEST_PLACE_ID}/`, (req, res, ctx) =>
        res(ctx.status(200), ctx.json(place))
      ),
      rest.get('*/language/', (req, res, ctx) =>
        res(ctx.status(200), ctx.json(languagesResponse))
      ),
    ]
  );
});

test('page is accessible', async () => {
  const { container } = render(<CreateEnrolmentPage />);

  await findElement('nameInput');
  expect(await axe(container)).toHaveNoViolations();
});

test('should validate enrolment form and focus invalid field', async () => {
  toast.error = jest.fn();

  render(<CreateEnrolmentPage />);

  const nameInput = await findElement('nameInput');
  const streetAddressInput = getElement('streetAddressInput');
  const yearOfBirthButton = getElement('yearOfBirthButton');
  const zipInput = getElement('zipInput');
  const cityInput = getElement('cityInput');
  const emailInput = getElement('emailInput');
  const phoneInput = getElement('phoneInput');
  const emailCheckbox = getElement('emailCheckbox');
  const phoneCheckbox = getElement('phoneCheckbox');
  const notificationLanguageButton = getElement('notificationLanguageButton');
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
  await waitFor(() => expect(yearOfBirthButton).toHaveFocus());

  userEvent.click(yearOfBirthButton);
  const yearOption = await screen.findByRole('option', { name: /1990/i });
  userEvent.click(yearOption);
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

  userEvent.type(phoneInput, enrolmentValues.phone);
  userEvent.click(submitButton);
  await waitFor(() => expect(notificationLanguageButton).toHaveFocus());

  userEvent.click(notificationLanguageButton);
  const notificationLanguageOption = await screen.findByRole('option', {
    name: /suomi/i,
  });
  userEvent.click(notificationLanguageOption);
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
    expect(toast.error).toBeCalledWith('TODO: Save enrolment')
  );
});
