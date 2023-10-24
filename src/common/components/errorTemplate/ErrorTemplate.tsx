import { IconAlertCircle } from 'hds-react';
import React from 'react';

import Container from '../../../domain/app/layout/container/Container';

import styles from './errorTemplate.module.scss';

interface Props {
  buttons?: React.ReactElement;
  text?: string;
  title: string;
}

const ErrorTemplate: React.FC<Props> = ({ buttons, text, title }) => {
  return (
    <Container contentWrapperClassName={styles.errorTemplate}>
      <div className={styles.content}>
        <IconAlertCircle className={styles.icon} />
        <h1>{title}</h1>
        {text && <p>{text}</p>}
        {buttons && <div className={styles.buttonsWrapper}>{buttons}</div>}
      </div>
    </Container>
  );
};

export default ErrorTemplate;
