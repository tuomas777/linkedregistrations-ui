/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from 'next-i18next';
import React from 'react';

import { ServerErrorItem } from '../../../types';
import { parseEnrolmentServerErrors } from './utils';

type ShowServerErrorsFnParams = {
  callbackFn?: () => void;
  error: any;
};

type UseEnrolmentServerErrorsState = {
  serverErrorItems: ServerErrorItem[];
  setServerErrorItems: (items: ServerErrorItem[]) => void;
  showServerErrors: (params: ShowServerErrorsFnParams) => void;
};

const useEnrolmentServerErrors = (): UseEnrolmentServerErrorsState => {
  const { t } = useTranslation();
  const [serverErrorItems, setServerErrorItems] = React.useState<
    ServerErrorItem[]
  >([]);

  const showServerErrors = ({
    callbackFn,
    error,
  }: ShowServerErrorsFnParams) => {
    /* istanbul ignore else */
    if (error) {
      setServerErrorItems(parseEnrolmentServerErrors({ error, t }));
      callbackFn && callbackFn();
    }
  };

  return { serverErrorItems, setServerErrorItems, showServerErrors };
};

export default useEnrolmentServerErrors;
