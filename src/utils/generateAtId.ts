import { LINKED_EVENTS_URL } from '../constants';

const generateAtId = (id: string, endpoint: string): string =>
  `${LINKED_EVENTS_URL}/${endpoint}/${id}/`;

export default generateAtId;
