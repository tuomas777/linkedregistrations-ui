import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

import { ExtendedSession } from '../../../types';
import { useUserQuery } from '../query';
import { User } from '../types';

export type UserState = {
  loading: boolean;
  user?: User;
};

const useUser = (): UserState => {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const userId = session?.user?.id ?? '';
  const linkedEventsApiToken = session?.apiTokens?.linkedevents;

  const {
    data: user,
    isFetching,
    status,
  } = useUserQuery({
    args: { username: userId },
    options: { enabled: Boolean(userId && linkedEventsApiToken) },
    session,
  });

  const state = useMemo(
    () => ({
      user,
      loading: status === 'loading' && isFetching,
    }),
    [isFetching, status, user]
  );
  return state;
};

export default useUser;
