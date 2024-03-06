import { useSession } from 'next-auth/react';

import { ExtendedSession } from '../../../types';
import { EVENT_WITH_SUB_EVENTS_INCLUDES, SuperEventType } from '../constants';
import { useEventQuery } from '../query';
import { Event } from '../types';

type UseEventWithSubEventsDataProps = {
  id: string;
  superEventType: SuperEventType | null;
};

type UseEventWithSubEventsDataState = {
  eventWithSubEvents: Event | undefined;
  isLoading: boolean;
};

const useEventWithSubEventsData = ({
  id,
  superEventType,
}: UseEventWithSubEventsDataProps): UseEventWithSubEventsDataState => {
  const { data: session } = useSession() as { data: ExtendedSession | null };

  const {
    data: eventWithSubEvents,
    isFetching: isFetchingEvent,
    status: statusEvent,
  } = useEventQuery({
    args: {
      id,
      include: EVENT_WITH_SUB_EVENTS_INCLUDES,
    },
    options: { enabled: !!superEventType, retry: 0 },
    session,
  });

  const isLoading = statusEvent === 'loading' && isFetchingEvent;

  return { eventWithSubEvents, isLoading };
};

export default useEventWithSubEventsData;
