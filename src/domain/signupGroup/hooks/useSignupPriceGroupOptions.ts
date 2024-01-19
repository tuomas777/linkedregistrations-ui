import useLocale from '../../../hooks/useLocale';
import { Registration } from '../../registration/types';
import { SignupPriceGroupOption } from '../types';
import { getSignupPriceGroupOptions } from '../utils';

const useSignupPriceGroupOptions = (
  registration: Registration
): SignupPriceGroupOption[] => {
  const locale = useLocale();

  return getSignupPriceGroupOptions(registration, locale);
};

export default useSignupPriceGroupOptions;
