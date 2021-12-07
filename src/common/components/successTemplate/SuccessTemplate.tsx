import { IconCheck } from 'hds-react';
import React from 'react';

import Container from '../../../domain/app/layout/container/Container';
import styles from './successTemplate.module.scss';

interface Props {
  title: string;
}

const SuccessTemplate: React.FC<Props> = ({ children, title }) => {
  return (
    <Container contentWrapperClassName={styles.successTemplate}>
      <div className={styles.content}>
        <IconCheck className={styles.icon} />
        <h1>{title}</h1>
        {children}
      </div>
    </Container>
  );
};

export default SuccessTemplate;
