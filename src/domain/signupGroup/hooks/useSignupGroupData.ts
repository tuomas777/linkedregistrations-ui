import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { ExtendedSession } from '../../../types';
import { useSignupGroupQuery } from '../query';
import { SignupGroup } from '../types';

type UseSignupGroupDataState = {
  isLoading: boolean;
  signupGroup: SignupGroup | undefined;
};

const useSignupGroupData = (): UseSignupGroupDataState => {
  const router = useRouter();
  const { query } = router;
  const { data: session } = useSession() as { data: ExtendedSession | null };

  const {
    data: signupGroup,
    isFetching,
    status,
  } = useSignupGroupQuery({
    args: { id: query.signupGroupId as string },
    session,
  });

  const isLoading = status === 'loading' && isFetching;

  return { isLoading, signupGroup };
};

export default useSignupGroupData;
