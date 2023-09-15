import {
  UseMutationOptions,
  UseMutationResult,
  useMutation,
} from '@tanstack/react-query';

import { ExtendedSession } from '../../types';

import {
  CreateSignupGroupMutationInput,
  CreateSignupGroupResponse,
  DeleteSignupGroupMutationInput,
} from './types';
import { createSignupGroup, deleteSignupGroup } from './utils';

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

export const useDeleteSignupGroupMutation = ({
  options,
  session,
}: {
  options?: UseMutationOptions<null, Error, DeleteSignupGroupMutationInput>;
  session: ExtendedSession | null;
}): UseMutationResult<null, Error, DeleteSignupGroupMutationInput> => {
  return useMutation(
    ({ id }) =>
      deleteSignupGroup({
        id,
        session,
      }),
    options
  );
};
