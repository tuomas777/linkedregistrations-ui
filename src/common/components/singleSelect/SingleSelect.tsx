import classNames from 'classnames';
import { Select, SingleSelectProps as HdsSingleSelectProps } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { OptionType } from '../../../types';
import {
  getA11ySelectionMessage,
  getA11yStatusMessage,
} from '../../../utils/accessibilityUtils';
import ComboboxLoadingSpinner, {
  ComboboxLoadingSpinnerProps,
} from '../comboboxLoadingSpinner/ComboboxLoadingSpinner';
import styles from '../select/select.module.scss';

export type SingleSelectProps = ComboboxLoadingSpinnerProps &
  HdsSingleSelectProps<OptionType>;

const SingleSelect: React.FC<SingleSelectProps> = ({
  className,
  isLoading,
  ...rest
}) => {
  const { t } = useTranslation('common');

  return (
    <ComboboxLoadingSpinner isLoading={isLoading}>
      <Select
        {...rest}
        className={classNames(className, styles.select)}
        getA11yStatusMessage={(options) => getA11yStatusMessage(options, t)}
        getA11ySelectionMessage={
          /* istanbul ignore next */
          (options) => getA11ySelectionMessage(options, t)
        }
      />
    </ComboboxLoadingSpinner>
  );
};

export default SingleSelect;
