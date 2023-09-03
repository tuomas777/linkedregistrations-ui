/* eslint-disable max-len */
import { NextPage } from 'next';

import EditEnrolmentPage from '../../../../../../domain/enrolment/EditEnrolmentPage';
import generateSignupGetServerSideProps from '../../../../../../utils/generateSignupGetServerSideProps';

const EditEnrolment: NextPage = () => <EditEnrolmentPage />;

export const getServerSideProps = generateSignupGetServerSideProps({
  shouldPrefetchPlace: false,
  shouldPrefetchSignup: true,
  translationNamespaces: ['common', 'enrolment'],
});

export default EditEnrolment;
