import { useSession } from 'next-auth/react';

import useMountedState from '../../../hooks/useMountedState';
import { ExtendedSession, MutationCallbacks } from '../../../types';
import { reportError } from '../../app/sentry/utils';
import { Registration } from '../../registration/types';
import { useCreateSignupGroupMutation } from '../../signupGroup/mutation';
import { useSignupGroupFormContext } from '../../signupGroup/signupGroupFormContext/hooks/useSignupGroupFormContext';
import { CreateSignupGroupMutationInput } from '../../signupGroup/types';
import { SIGNUP_ACTIONS } from '../constants';
import { useDeleteSignupMutation } from '../mutation';
import { DeleteSignupMutationInput, Signup } from '../types';

interface Props {
  registration: Registration;
  signup?: Signup;
}

type UseSignupActionsState = {
  createSignupGroup: (
    payload: CreateSignupGroupMutationInput,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
  deleteSignup: (callbacks?: MutationCallbacks) => Promise<void>;
  saving: SIGNUP_ACTIONS | null;
};
const useSignupActions = ({
  registration,
  signup,
}: Props): UseSignupActionsState => {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const [saving, setSaving] = useMountedState<SIGNUP_ACTIONS | null>(null);

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

  const handleError = ({
    callbacks,
    error,
    message,
    payload,
  }: {
    callbacks?: MutationCallbacks;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: any;
    message: string;
    payload?: CreateSignupGroupMutationInput | DeleteSignupMutationInput;
  }) => {
    closeModal();
    savingFinished();

    // Report error to Sentry
    reportError({
      data: {
        error,
        payloadAsString: payload && JSON.stringify(payload),
        signup,
      },
      message,
    });

    // Call callback function if defined
    callbacks?.onError?.(error);
  };

  const deleteSignupMutation = useDeleteSignupMutation({
    session,
  });
  const createSignupGroupMutation = useCreateSignupGroupMutation({
    session,
  });

  const createSignupGroup = async (
    payload: CreateSignupGroupMutationInput,
    callbacks?: MutationCallbacks
  ) => {
    setSaving(SIGNUP_ACTIONS.CREATE);
    createSignupGroupMutation.mutate(payload, {
      onError: (error, variables) => {
        handleError({
          callbacks,
          error,
          message: 'Failed to create signup group',
          payload: variables,
        });
      },
      onSuccess: () => {
        cleanAfterUpdate(callbacks);
      },
    });
  };

  const deleteSignup = async (callbacks?: MutationCallbacks) => {
    setSaving(SIGNUP_ACTIONS.DELETE);

    deleteSignupMutation.mutate(
      {
        registrationId: registration.id,
        signupId: signup?.id as string,
      },
      {
        onError: (error, variables) => {
          handleError({
            callbacks,
            error,
            message: 'Failed to delete signup',
            payload: variables,
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
    deleteSignup,
    saving,
  };
};

export default useSignupActions;
