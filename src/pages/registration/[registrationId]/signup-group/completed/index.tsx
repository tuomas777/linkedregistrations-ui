import { NextPage } from 'next';

import SignupGroupCompletedPage from '../../../../../domain/signupGroup/SignupGroupCompletedPage';
import generateSignupGetServerSideProps from '../../../../../utils/generateSignupGetServerSideProps';

const SignupGroupCompleted: NextPage = () => <SignupGroupCompletedPage />;

export const getServerSideProps = generateSignupGetServerSideProps({
  shouldPrefetchPlace: false,
  shouldPrefetchSignup: false,
  translationNamespaces: ['common', 'signup'],
});

export default SignupGroupCompleted;
