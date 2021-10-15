import classNames from 'classnames';
import { Select, SingleSelectProps } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { OptionType } from '../../../types';
import {
  getA11ySelectionMessage,
  getA11yStatusMessage,
} from '../../../utils/accessibilityUtils';
import styles from '../select/select.module.scss';

const SingleSelect: React.FC<SingleSelectProps<OptionType>> = ({
  className,
  ...rest
}) => {
  const { t } = useTranslation('common');

  return (
    <Select
      {...rest}
      className={classNames(className, styles.select)}
      getA11yStatusMessage={(options) => getA11yStatusMessage(options, t)}
      getA11ySelectionMessage={
        /* istanbul ignore next */
        (options) => getA11ySelectionMessage(options, t)
      }
    />
  );
};

export default SingleSelect;
