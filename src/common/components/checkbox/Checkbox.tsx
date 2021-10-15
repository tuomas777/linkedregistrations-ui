import classNames from 'classnames';
import { Checkbox as BaseCheckbox, CheckboxProps } from 'hds-react';
import React from 'react';

import styles from './checkbox.module.scss';

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, ...rest }, ref) => {
    return (
      <BaseCheckbox
        {...rest}
        className={classNames(className, styles.checkbox)}
        ref={ref}
      />
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
