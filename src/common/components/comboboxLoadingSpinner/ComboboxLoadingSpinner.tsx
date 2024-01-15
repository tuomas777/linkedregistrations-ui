import classNames from 'classnames';
import { FC, PropsWithChildren } from 'react';

import LoadingSpinner from '../loadingSpinner/LoadingSpinner';

import styles from './comboboxLoadingSpinner.module.scss';

export type ComboboxLoadingSpinnerProps = {
  isLoading?: boolean;
};

const ComboboxLoadingSpinner: FC<
  PropsWithChildren<ComboboxLoadingSpinnerProps>
> = ({ children, isLoading }) => {
  return (
    <div className={styles.comboboxLoadingSpinner}>
      {children}
      {isLoading && (
        <div className={classNames(styles.loadingSpinnerWrapper)}>
          <LoadingSpinner
            className={styles.loadingSpinner}
            isLoading={isLoading}
            small={true}
          />
        </div>
      )}
    </div>
  );
};

export default ComboboxLoadingSpinner;
