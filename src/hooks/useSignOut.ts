import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';

import { SIGNOUT_REDIRECT } from '../constants';
import { ExtendedSession } from '../types';

const useSignOut = () => {
  const { data: session } = useSession() as { data: ExtendedSession | null };
  const router = useRouter();

  const handleSignOut = async () => {
    const { url } = await signOut({
      callbackUrl: SIGNOUT_REDIRECT,
      redirect: false,
    });
    router.push(`${url}&id_token_hint=${session?.idToken}`);
    sessionStorage.clear();
  };

  return { handleSignOut };
};

export default useSignOut;
