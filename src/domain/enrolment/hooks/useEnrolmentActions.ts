import { useSession } from 'next-auth/react';

import useMountedState from '../../../hooks/useMountedState';
import { ExtendedSession, MutationCallbacks } from '../../../types';
import { reportError } from '../../app/sentry/utils';
import { Registration } from '../../registration/types';
import { CreateSignupGroupMutationInput } from '../../signupGroup/types';
import { ENROLMENT_ACTIONS } from '../constants';
import { useEnrolmentPageContext } from '../enrolmentPageContext/hooks/useEnrolmentPageContext';
import {
  useCreateSignupGroupMutation,
  useDeleteEnrolmentMutation,
} from '../mutation';
import { DeleteEnrolmentMutationInput, Signup } from '../types';

interface Props {
  enrolment?: Signup;
  registration: Registration;
}

type UseEnrolmentActionsState = {
  cancelEnrolment: (callbacks?: MutationCallbacks) => Promise<void>;
  createSignupGroup: (
    payload: CreateSignupGroupMutationInput,
    callbacks?: MutationCallbacks
  ) => Promise<void>;
  saving: ENROLMENT_ACTIONS | null;
};
const useEnrolmentActions = ({
  enrolment,
  registration,
}: Props): UseEnrolmentActionsState => {
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
    payload?: CreateSignupGroupMutationInput | DeleteEnrolmentMutationInput;
  }) => {
    closeModal();
    savingFinished();

    // Report error to Sentry
    reportError({
      data: {
        error,
        payloadAsString: payload && JSON.stringify(payload),
        enrolment,
      },
      message,
    });

    // Call callback function if defined
    callbacks?.onError?.(error);
  };

  const deleteEnrolmentMutation = useDeleteEnrolmentMutation({
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

  const cancelEnrolment = async (callbacks?: MutationCallbacks) => {
    setSaving(ENROLMENT_ACTIONS.CANCEL);

    deleteEnrolmentMutation.mutate(
      {
        enrolmentId: enrolment?.id as string,
        registrationId: registration.id,
      },
      {
        onError: (error, variables) => {
          handleError({
            callbacks,
            error,
            message: 'Failed to cancel enrolment',
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
    cancelEnrolment,
    createSignupGroup,
    saving,
  };
};

export default useEnrolmentActions;
