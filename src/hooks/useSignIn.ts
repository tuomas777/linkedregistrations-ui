import { signIn } from 'next-auth/react';

import useLocale from './useLocale';

const useSignIn = () => {
  const locale = useLocale();

  const handleSignIn = async () => {
    signIn('tunnistamo', undefined, { ui_locales: locale });
  };

  return { handleSignIn };
};

export default useSignIn;
