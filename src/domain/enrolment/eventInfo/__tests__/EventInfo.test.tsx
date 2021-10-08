/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @jest-environment jsdom
 */
import { rest } from 'msw';
import React from 'react';

import {
  actWait,
  configure,
  render,
  screen,
  setQueryMocks,
} from '../../../../utils/testUtils';
import {
  event,
  eventOverrides,
  locationText,
} from '../../../event/__mocks__/event';
import { keywordsOverrides } from '../../../keyword/__mocks__/keyword';
import { place } from '../../../place/__mocks__/place';
import { TEST_PLACE_ID } from '../../../place/constants';
import EventInfo from '../EventInfo';

configure({ defaultHidden: true });

const findElement = (key: 'location') => {
  switch (key) {
    case 'location':
      return screen.findByText(locationText);
  }
};

const getElement = (key: 'age' | 'date' | 'description' | 'name' | 'price') => {
  switch (key) {
    case 'age':
      return screen.getByText('8 – 15 v');
    case 'date':
      return screen.getByText('10.07.2020 – 13.07.2020');
    case 'description':
      return screen.getByText(eventOverrides.description.fi as string);
    case 'name':
      return screen.getByText(eventOverrides.name.fi as string);
    case 'price':
      return screen.getByText(eventOverrides.offers[0].price.fi as string);
  }
};

beforeEach(() => {
  setQueryMocks(
    ...[
      rest.get(`*/place/${TEST_PLACE_ID}/`, (req, res, ctx) =>
        res(ctx.status(200), ctx.json(place))
      ),
    ]
  );
});

test('should show event info', async () => {
  render(<EventInfo event={event} />);

  await findElement('location');
  getElement('name');
  keywordsOverrides.forEach((item) =>
    screen.getByText(item.name?.fi as string)
  );
  getElement('description');
  getElement('price');
  await actWait(1000);
  getElement('age');
});
