import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';

import { ExtendedSession } from '../../types';
import {
  CreateSignupGroupMutationInput,
  CreateSignupGroupResponse,
  DeleteEnrolmentMutationInput,
} from './types';
import { createSignupGroup, deleteEnrolment } from './utils';

export const useCreateSignupGroupMutation = ({
  options,
  session,
}: {
  options?: UseMutationOptions<
    CreateSignupGroupResponse,
    Error,
    CreateSignupGroupMutationInput
  >;
  session: ExtendedSession | null;
}): UseMutationResult<
  CreateSignupGroupResponse,
  Error,
  CreateSignupGroupMutationInput
> => {
  return useMutation((input) => createSignupGroup({ input, session }), options);
};

export const useDeleteEnrolmentMutation = ({
  options,
  session,
}: {
  options?: UseMutationOptions<null, Error, DeleteEnrolmentMutationInput>;
  session: ExtendedSession | null;
}): UseMutationResult<null, Error, DeleteEnrolmentMutationInput> => {
  return useMutation(
    ({ enrolmentId }) =>
      deleteEnrolment({
        enrolmentId,
        session,
      }),
    options
  );
};
