import { QueryClient, useQuery, UseQueryResult } from 'react-query';

import { Event, EventQueryVariables } from './types';
import { fetchEvent } from './utils';

export const prefetchEventQuery = (
  queryClient: QueryClient,
  args: EventQueryVariables
): Promise<void> => {
  return queryClient.prefetchQuery('event', () => fetchEvent(args));
};

export const useEventQuery = (
  args: EventQueryVariables
): UseQueryResult<Event> => {
  return useQuery<Event, Error>('event', () => fetchEvent(args));
};
