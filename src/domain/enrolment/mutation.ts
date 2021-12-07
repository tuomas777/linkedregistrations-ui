import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
} from 'react-query';

import { CreateEnrolmentMutationInput, Enrolment } from './types';
import { createEnrolment } from './utils';

export const useCreateEnrolmentMutation = (
  options?: UseMutationOptions<Enrolment, Error, CreateEnrolmentMutationInput>
): UseMutationResult<Enrolment, Error, CreateEnrolmentMutationInput> => {
  return useMutation((input) => createEnrolment(input), options);
};
