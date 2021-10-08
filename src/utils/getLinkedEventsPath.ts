import { LINKED_EVENTS_URL } from '../constants';

export const getLinkedEventsUrl = (path = ''): string =>
  `${LINKED_EVENTS_URL}${path?.startsWith('/') ? path : `/${path}`}`;
