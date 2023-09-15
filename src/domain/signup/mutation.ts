import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from '@tanstack/react-query';

import { ExtendedSession } from '../../types';

import { DeleteSignupMutationInput } from './types';
import { deleteSignup } from './utils';

export const useDeleteSignupMutation = ({
  options,
  session,
}: {
  options?: UseMutationOptions<null, Error, DeleteSignupMutationInput>;
  session: ExtendedSession | null;
}): UseMutationResult<null, Error, DeleteSignupMutationInput> => {
  return useMutation(
    ({ signupId }) =>
      deleteSignup({
        id: signupId,
        session,
      }),
    options
  );
};
