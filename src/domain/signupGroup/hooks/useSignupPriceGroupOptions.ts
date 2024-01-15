import useLocale from '../../../hooks/useLocale';
import getLocalisedString from '../../../utils/getLocalisedString';
import { Registration } from '../../registration/types';
import { SignupPriceGroupOption } from '../types';

const useSignupPriceGroupOptions = (
  registration: Registration
): SignupPriceGroupOption[] => {
  const locale = useLocale();

  return (
    registration.registration_price_groups?.map((pg) => {
      const price = pg?.price ? Number(pg.price) : 0;

      return {
        label: [
          `${getLocalisedString(pg?.price_group?.description, locale)}`,
          `${price.toFixed(2).replace('.', ',')} €`,
        ].join(' '),
        price,
        value: pg?.id?.toString() ?? /* istanbul ignore next */ '',
      };
    }) ?? /* istanbul ignore next */ []
  );
};

export default useSignupPriceGroupOptions;
