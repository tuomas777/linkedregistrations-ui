/* istanbul ignore next */
const LINKED_EVENTS_URL =
  process.env.REACT_APP_LINKED_EVENTS_URL ??
  'https://linkedevents-api.dev.hel.ninja/linkedevents-dev/v1';

export const getLinkedEventsUrl = (path = ''): string =>
  `${LINKED_EVENTS_URL}${path?.startsWith('/') ? path : `/${path}`}`;
