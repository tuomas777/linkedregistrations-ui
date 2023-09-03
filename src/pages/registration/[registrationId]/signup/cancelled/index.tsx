import { NextPage } from 'next';

import SignupCancelledPage from '../../../../../domain/signup/SignupCancelledPage';
import generateSignupGetServerSideProps from '../../../../../utils/generateSignupGetServerSideProps';

const SignupCancelled: NextPage = () => <SignupCancelledPage />;

export const getServerSideProps = generateSignupGetServerSideProps({
  shouldPrefetchPlace: false,
  shouldPrefetchSignup: false,
  translationNamespaces: ['common', 'enrolment'],
});

export default SignupCancelled;
