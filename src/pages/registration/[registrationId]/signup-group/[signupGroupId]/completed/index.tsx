import { NextPage } from 'next';

import SignupGroupCompletedPage from '../../../../../../domain/signupGroup/SignupGroupCompletedPage';
import generateSignupGroupGetServerSideProps from '../../../../../../utils/generateSignupGroupGetServerSideProps';

const SignupGroupCompleted: NextPage = () => <SignupGroupCompletedPage />;

export const getServerSideProps = generateSignupGroupGetServerSideProps({
  shouldPrefetchPlace: false,
  shouldPrefetchSignupGroup: true,
  translationNamespaces: ['common', 'signup'],
});

export default SignupGroupCompleted;
