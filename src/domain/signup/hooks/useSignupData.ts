import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import { ExtendedSession } from '../../../types';
import { useSignupQuery } from '../query';
import { Signup } from '../types';

type UseSignupDataState = {
  isLoading: boolean;
  signup: Signup | undefined;
};

const useSignupData = (): UseSignupDataState => {
  const router = useRouter();
  const { query } = router;
  const { data: session } = useSession() as { data: ExtendedSession | null };

  const {
    data: signup,
    isFetching,
    status,
  } = useSignupQuery({
    args: { id: query.signupId as string },
    session,
  });

  const isLoading = status === 'loading' && isFetching;

  return { isLoading, signup };
};

export default useSignupData;
