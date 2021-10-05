import React from 'react';

import Container from '../app/layout/container/Container';
import MainContent from '../app/layout/mainContent/MainContent';
import EnrolmentForm from './enrolmentForm/EnrolmentForm';
import styles from './enrolmentPage.module.scss';

const CreateEnrolmentPage: React.FC = () => {
  return (
    <MainContent>
      <Container withOffset>
        <div className={styles.formContainer}>
          <EnrolmentForm />
        </div>
      </Container>
    </MainContent>
  );
};

export default CreateEnrolmentPage;
