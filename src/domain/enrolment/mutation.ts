import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';

import { ExtendedSession } from '../../types';
import {
  CreateSignupGroupMutationInput,
  CreateSignupGroupResponse,
} from '../signupGroup/types';
import { createSignupGroup } from '../signupGroup/utils';
import { DeleteEnrolmentMutationInput } from './types';
import { deleteEnrolment } from './utils';

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
