import { ButtonProps } from 'hds-react';
import React from 'react';

import Button from '../button/Button';
import LoadingSpinner from '../loadingSpinner/LoadingSpinner';

import styles from './loadingButton.module.scss';

export type LoadingButtonProps = {
  icon: React.ReactNode;
  loading: boolean;
} & ButtonProps;

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, icon, loading, ...rest }, ref) => {
    return (
      <Button
        {...rest}
        ref={ref}
        iconLeft={
          loading ? (
            <LoadingSpinner
              className={styles.loadingSpinner}
              isLoading={true}
              small={true}
            />
          ) : (
            icon
          )
        }
      >
        {children}
      </Button>
    );
  }
);

LoadingButton.displayName = 'LoadingButton';

export default LoadingButton;
