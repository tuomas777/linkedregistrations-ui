/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { fakeEvent } from '../../../../utils/mockDataUtils';
import { render, screen, userEvent } from '../../../../utils/testUtils';
import { TEST_EVENT_ID } from '../../constants';
import EventCalendarButton, {
  EventCalendarButtonProps,
} from '../EventCalendarButton';

const defaultProps: EventCalendarButtonProps = {
  event: fakeEvent({ id: TEST_EVENT_ID }),
};

afterEach(() => {
  jest.restoreAllMocks();
});

const renderComponent = (props?: Partial<EventCalendarButtonProps>) =>
  render(<EventCalendarButton {...defaultProps} {...props} />);

test('should download an ics file successfully', async () => {
  const user = userEvent.setup();
  renderComponent();

  // Mock these functions after renderComponent to avoid issues with initial rendering
  const link = { click: jest.fn() } as any;
  const href = 'https://test.com';
  jest.spyOn(document, 'createElement').mockImplementation(() => link);
  global.URL.createObjectURL = jest.fn(() => href);
  global.URL.revokeObjectURL = jest.fn();

  const addToCalendarButton = screen.getByRole('button', {
    name: 'Lisää kalenteriin',
  });
  await user.click(addToCalendarButton);

  expect(link.download).toEqual(`event_${TEST_EVENT_ID}.ics`);
  expect(link.href).toEqual(href);
  expect(link.click).toHaveBeenCalledTimes(1);
});

test('should call custom onClick function', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  renderComponent({ onClick });

  const addToCalendarButton = screen.getByRole('button', {
    name: 'Lisää kalenteriin',
  });
  await user.click(addToCalendarButton);

  expect(onClick).toHaveBeenCalledTimes(1);
});
