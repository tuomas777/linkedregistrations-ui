import { DateArray, DateTime, EventAttributes, createEvent } from 'ics';
import { TFunction } from 'next-i18next';

import { AddNotificationFn } from '../../common/components/notificationsContext/NotificationsContext';
import { Language } from '../../types';
import getLocalisedString from '../../utils/getLocalisedString';
import { getPlaceFields } from '../place/utils';

import { Event, EventFields } from './types';

export const getEventFields = (event: Event, locale: Language): EventFields => {
  return {
    audienceMaxAge: event.audience_max_age || null,
    audienceMinAge: event.audience_min_age || null,
    description: getLocalisedString(event.description, locale),
    endTime: event.end_time ? new Date(event.end_time) : null,
    freeEvent: !!event.offers[0]?.is_free,
    imageUrl: event.images.find((image) => image?.url)?.url || null,
    keywords: event.keywords.filter((id) => id),
    name: getLocalisedString(event.name, locale),
    offers: event.offers.filter((offer) => !!offer && !offer?.is_free),
    shortDescription: getLocalisedString(event.short_description, locale),
    startTime: event.start_time ? new Date(event.start_time) : null,
  };
};

export const getEventLocationText = ({
  event,
  locale,
}: {
  event: Event;
  locale: Language;
}): string => {
  const { location } = event;
  const {
    addressLocality,
    name: locationName,
    streetAddress,
  } = location
    ? getPlaceFields(location, locale)
    : { addressLocality: '', name: '', streetAddress: '' };

  return (
    [locationName, streetAddress, addressLocality]
      .filter((e) => e)
      .join(', ') || '-'
  );
};

const getDateArray = (date: Date): DateArray => [
  date.getFullYear(),
  date.getMonth() + 1,
  date.getDate(),
  date.getHours(),
  date.getMinutes(),
];

export const getEventAttributes = ({
  event,
  locale,
}: {
  event: Event;
  locale: Language;
}) => {
  const { name, shortDescription } = getEventFields(event, locale);
  const startTime = event.start_time ? new Date(event.start_time) : new Date();
  const endTime = event.end_time ? new Date(event.end_time) : null;

  const start: DateTime = getDateArray(startTime);
  const end: DateTime = endTime ? getDateArray(endTime) : start;
  const eventAttributes: EventAttributes = {
    start,
    end,
    title: name,
    description: shortDescription,
    location: getEventLocationText({ event, locale }),
  };

  return eventAttributes;
};

export const downloadEventIcsFile = async ({
  addNotification,
  event,
  locale,
  t,
}: {
  addNotification: AddNotificationFn;
  event: Event;
  locale: Language;
  t: TFunction;
}) => {
  try {
    const filename = `event_${event.id}.ics`;
    const file: File = await new Promise((resolve, reject) => {
      createEvent(getEventAttributes({ event, locale }), (error, value) => {
        if (error) {
          reject(error);
        }
        resolve(new File([value], filename, { type: 'text/calendar' }));
      });
    });

    const href = URL.createObjectURL(file);
    const anchor = document.createElement('a');
    anchor.download = filename;
    anchor.href = href;
    anchor.click();

    URL.revokeObjectURL(href);
  } catch {
    addNotification({
      label: t('common:eventCalendarButton.failedToCreateFile'),
      type: 'error',
    });
  }
};
