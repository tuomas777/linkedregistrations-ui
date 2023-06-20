import React from 'react';

import useLocale from '../../../hooks/useLocale';
import { OptionType } from '../../../types';
import { useLanguagesQuery } from '../../language/query';
import { LanguagesQueryVariables } from '../../language/types';
import { getLanguageOption, sortLanguageOptions } from '../../language/utils';

const useLanguageOptions = (
  variables?: LanguagesQueryVariables
): OptionType[] => {
  const locale = useLocale();

  const { data } = useLanguagesQuery(variables);

  const languageOptions = React.useMemo(() => {
    return (
      data?.data
        ?.map((language) => getLanguageOption(language, locale))
        .sort(sortLanguageOptions) ?? []
    );
  }, [data, locale]);

  return languageOptions;
};

export default useLanguageOptions;
