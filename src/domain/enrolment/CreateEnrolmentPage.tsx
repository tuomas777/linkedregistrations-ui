import React from 'react';

import Container from '../app/layout/container/Container';
import EnrolmentForm from './enrolmentForm/EnrolmentForm';
import styles from './enrolmentPage.module.scss';

const CreateEnrolmentPage: React.FC = () => {
  return (
    <Container withOffset>
      <div className={styles.formContainer}>
        <EnrolmentForm />
      </div>
    </Container>
  );
};

export default CreateEnrolmentPage;
