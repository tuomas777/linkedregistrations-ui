import classNames from 'classnames';
import { Button as BaseButton, ButtonProps, ButtonVariant } from 'hds-react';
import React from 'react';

import styles from './button.module.scss';

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...rest }, ref) => {
    return (
      <BaseButton
        variant={variant as Exclude<ButtonVariant, 'supplementary'>}
        className={classNames(className, styles.button)}
        ref={ref}
        {...rest}
      />
    );
  }
);

Button.displayName = 'Button';

export default Button;
