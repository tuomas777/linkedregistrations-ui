import { useSession } from 'next-auth/react';

import useMountedState from '../../../hooks/useMountedState';
import { ExtendedSession, MutationCallbacks } from '../../../types';
import { reportError } from '../../app/sentry/utils';
import { ENROLMENT_ACTIONS } from '../../enrolment/constants';
import { useEnrolmentPageContext } from '../../enrolment/enrolmentPageContext/hooks/useEnrolmentPageContext';
import { Registration } from '../../registration/types';
import { useCreateSignupGroupMutation } from '../../signupGroup/mutation';
import { CreateSignupGroupMutationInput } from '../../signupGroup/types';
import { useDeleteSignupMutation } from '../mutation';
import { DeleteSignupMutationInput, Signup } from '../types';

interface Props {
  registration: Registration;
  signup?: Signup;
}

type UseSignupActionsState = {
  cancelSignup: (callbacks?: MutationCallbacks) => Promise<void>;
  createSignupGroup: (
    payload: CreateSignupGroupMutationInput,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
  saving: ENROLMENT_ACTIONS | null;
};
const useSignupActions = ({
  registration,
  signup,
}: Props): UseSignupActionsState => {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const [saving, setSaving] = useMountedState<ENROLMENT_ACTIONS | null>(null);

  const { closeModal } = useEnrolmentPageContext();

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
    setSaving(ENROLMENT_ACTIONS.CREATE);
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

  const cancelSignup = async (callbacks?: MutationCallbacks) => {
    setSaving(ENROLMENT_ACTIONS.CANCEL);

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
            message: 'Failed to cancel signup',
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
    cancelSignup,
    createSignupGroup,
    saving,
  };
};

export default useSignupActions;
