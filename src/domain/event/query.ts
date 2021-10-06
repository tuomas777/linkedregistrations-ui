import { useQuery, UseQueryResult } from 'react-query';

import { Event, EventQueryVariables } from './types';
import { fetchEvent } from './utils';

export const useEventQuery = (
  args: EventQueryVariables
): UseQueryResult<Event> => {
  return useQuery<Event, Error>('event', () => fetchEvent(args));
};
