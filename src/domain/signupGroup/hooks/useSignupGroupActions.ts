import { useSession } from 'next-auth/react';

import useHandleError from '../../../hooks/useHandleError';
import useMountedState from '../../../hooks/useMountedState';
import { ExtendedSession, MutationCallbacks } from '../../../types';
import { SIGNUP_GROUP_ACTIONS } from '../constants';
import {
  useCreateSignupGroupMutation,
  useDeleteSignupGroupMutation,
} from '../mutation';
import { useSignupGroupFormContext } from '../signupGroupFormContext/hooks/useSignupGroupFormContext';
import {
  CreateSignupGroupMutationInput,
  DeleteSignupGroupMutationInput,
  SignupGroup,
} from '../types';

interface Props {
  signupGroup?: SignupGroup;
}

type UseSignupActionsState = {
  createSignupGroup: (
    payload: CreateSignupGroupMutationInput,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
  deleteSignupGroup: (callbacks?: MutationCallbacks) => Promise<void>;
  saving: SIGNUP_GROUP_ACTIONS | null;
};
const useSignupGroupActions = ({
  signupGroup,
}: Props = {}): UseSignupActionsState => {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const [saving, setSaving] = useMountedState<SIGNUP_GROUP_ACTIONS | null>(
    null
  );
  const { closeModal } = useSignupGroupFormContext();

  const savingFinished = () => {
    setSaving(null);
  };

  const cleanAfterUpdate = async (callbacks?: MutationCallbacks) => {
    savingFinished();
    closeModal();
    // Call callback function if defined
    await (callbacks?.onSuccess && callbacks.onSuccess());
  };

  const { handleError } = useHandleError<
    CreateSignupGroupMutationInput | DeleteSignupGroupMutationInput,
    SignupGroup
  >();

  const deleteSignupGroupMutation = useDeleteSignupGroupMutation({
    session,
  });
  const createSignupGroupMutation = useCreateSignupGroupMutation({
    session,
  });

  const createSignupGroup = async (
    payload: CreateSignupGroupMutationInput,
    callbacks?: MutationCallbacks
  ) => {
    setSaving(SIGNUP_GROUP_ACTIONS.CREATE);
    createSignupGroupMutation.mutate(payload, {
      onError: (error, variables) => {
        handleError({
          callbacks,
          error,
          message: 'Failed to create signup group',
          payload: variables,
          savingFinished,
        });
      },
      onSuccess: () => {
        cleanAfterUpdate(callbacks);
      },
    });
  };

  const deleteSignupGroup = async (callbacks?: MutationCallbacks) => {
    setSaving(SIGNUP_GROUP_ACTIONS.DELETE);

    deleteSignupGroupMutation.mutate(
      {
        id: signupGroup?.id as string,
      },
      {
        onError: (error, variables) => {
          handleError({
            callbacks,
            error,
            message: 'Failed to delete signup',
            object: signupGroup,
            payload: variables,
            savingFinished,
          });
        },
        onSuccess: () => {
          cleanAfterUpdate(callbacks);
        },
      }
    );
  };

  return {
    createSignupGroup,
    deleteSignupGroup,
    saving,
  };
};

export default useSignupGroupActions;
