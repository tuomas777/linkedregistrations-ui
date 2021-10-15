import parseIdFromAtId from '../../../utils/parseIdFromAtId';
import { usePlaceQuery } from '../../place/query';
import { Place } from '../../place/types';
import { Event } from '../types';

type UseEventLocationState = {
  isLoading: boolean;
  location: Place | null;
};

const useEventLocation = (event: Event): UseEventLocationState => {
  /* istanbul ignore next */
  const id: string = event.location?.['@id']
    ? (parseIdFromAtId(event.location['@id']) as string)
    : '';
  const { data, isLoading } = usePlaceQuery(id);

  return { isLoading, location: data ?? null };
};

export default useEventLocation;
