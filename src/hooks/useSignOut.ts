import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';

import { SIGNOUT_REDIRECT } from '../constants';

const useSignOut = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    const { url } = await signOut({
      callbackUrl: SIGNOUT_REDIRECT,
      redirect: false,
    });
    router.push(url);
    sessionStorage.clear();
  };

  return { handleSignOut };
};

export default useSignOut;
