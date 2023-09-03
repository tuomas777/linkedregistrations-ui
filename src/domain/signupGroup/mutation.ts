import {
  UseMutationOptions,
  UseMutationResult,
  useMutation,
} from '@tanstack/react-query';

import { ExtendedSession } from '../../types';
import {
  CreateSignupGroupMutationInput,
  CreateSignupGroupResponse,
} from './types';
import { createSignupGroup } from './utils';

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
