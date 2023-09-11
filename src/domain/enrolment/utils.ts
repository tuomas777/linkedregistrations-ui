import { AxiosError } from 'axios';

import { ExtendedSession } from '../../types';
import { callDelete, callGet } from '../app/axios/axiosClient';
import { EnrolmentQueryVariables, Signup } from './types';

export const fetchEnrolment = async (
  args: EnrolmentQueryVariables,
  session: ExtendedSession | null
): Promise<Signup> => {
  try {
    const { data } = await callGet({
      session,
      url: enrolmentPathBuilder(args),
    });
    return data;
  } catch (error) {
    /* istanbul ignore next */
    throw Error(JSON.stringify((error as AxiosError).response?.data));
  }
};

export const enrolmentPathBuilder = (args: EnrolmentQueryVariables): string => {
  const { enrolmentId } = args;
  return `/signup/${enrolmentId}/`;
};

export const deleteEnrolment = async ({
  enrolmentId,
  session,
}: {
  enrolmentId: string;
  session: ExtendedSession | null;
}): Promise<null> => {
  try {
    const { data } = await callDelete({
      session,
      url: `/signup/${enrolmentId}/`,
    });
    return data;
  } catch (error) {
    throw Error(JSON.stringify((error as AxiosError).response?.data));
  }
};
