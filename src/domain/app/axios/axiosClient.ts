import axios from 'axios';

import { LINKED_EVENTS_URL } from '../../../constants';

export default axios.create({
  baseURL: LINKED_EVENTS_URL,
  headers: { 'Content-Type': 'application/json' },
});
