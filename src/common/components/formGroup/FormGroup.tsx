import React from 'react';

import styles from './formGroup.module.scss';

const FormGroup: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return <div className={styles.formGroup}>{children}</div>;
};

export default FormGroup;
