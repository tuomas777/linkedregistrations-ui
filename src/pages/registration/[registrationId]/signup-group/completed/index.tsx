import { NextPage } from 'next';

import SignupGroupCompletedPage from '../../../../../domain/signupGroup/SignupGroupCompletedPage';
import generateEnrolmentGetServerSideProps from '../../../../../utils/generateEnrolmentGetServerSideProps';

const SignupGroupCompleted: NextPage = () => <SignupGroupCompletedPage />;

export const getServerSideProps = generateEnrolmentGetServerSideProps({
  shouldPrefetchEnrolment: false,
  shouldPrefetchPlace: false,
  translationNamespaces: ['common', 'enrolment'],
});

export default SignupGroupCompleted;
