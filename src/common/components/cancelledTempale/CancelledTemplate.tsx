import { IconCross } from 'hds-react';
import React from 'react';

import Container from '../../../domain/app/layout/container/Container';
import styles from './cancelledTemplate.module.scss';

interface Props {
  title: string;
}

const CancelledTemplate: React.FC<Props> = ({ children, title }) => {
  return (
    <Container contentWrapperClassName={styles.cancelledTemplate}>
      <div className={styles.content}>
        <IconCross className={styles.icon} aria-hidden={true} />
        <h1>{title}</h1>
        {children}
      </div>
    </Container>
  );
};

export default CancelledTemplate;
