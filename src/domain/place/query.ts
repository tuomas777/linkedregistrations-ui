import { useQuery, UseQueryResult } from 'react-query';

import { Place } from './types';
import { fetchPlace } from './utils';

export const usePlaceQuery = (id: string): UseQueryResult<Place> => {
  return useQuery<Place, Error>('place', () => fetchPlace(id));
};
