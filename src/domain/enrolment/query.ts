import {
  QueryClient,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';

import { ExtendedSession } from '../../types';
import { EnrolmentQueryVariables, Signup } from './types';
import { fetchEnrolment } from './utils';

export const fetchEnrolmentQuery = ({
  args,
  queryClient,
  session,
}: {
  args: EnrolmentQueryVariables;
  queryClient: QueryClient;
  session: ExtendedSession | null;
}): Promise<Signup> => {
  return queryClient.fetchQuery(['enrolment', args.enrolmentId], () =>
    fetchEnrolment(args, session)
  );
};

export const prefetchEnrolmentQuery = ({
  args,
  queryClient,
  session,
}: {
  args: EnrolmentQueryVariables;
  queryClient: QueryClient;
  session: ExtendedSession | null;
}): Promise<void> => {
  return queryClient.prefetchQuery(['enrolment', args.enrolmentId], () =>
    fetchEnrolment(args, session)
  );
};

export const useEnrolmentQuery = ({
  args,
  options,
  session,
}: {
  args: EnrolmentQueryVariables;
  options?: Pick<UseQueryOptions, 'enabled'>;
  session: ExtendedSession | null;
}): UseQueryResult<Signup> => {
  return useQuery<Signup, Error>(
    ['enrolment', args.enrolmentId],
    () => fetchEnrolment(args, session),
    options
  );
};
