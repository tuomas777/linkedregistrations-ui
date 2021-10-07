import { QueryClient, useQuery, UseQueryResult } from 'react-query';

import { Place } from './types';
import { fetchPlace } from './utils';

export const prefetchPlaceQuery = (
  queryClient: QueryClient,
  id: string
): Promise<void> => queryClient.prefetchQuery('place', () => fetchPlace(id));

export const usePlaceQuery = (id: string): UseQueryResult<Place> => {
  return useQuery<Place, Error>('place', () => fetchPlace(id));
};
