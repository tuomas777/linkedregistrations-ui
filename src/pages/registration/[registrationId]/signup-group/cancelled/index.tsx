import { NextPage } from 'next';

import SignupCancelledPage from '../../../../../domain/signup/SignupCancelledPage';
import generateSignupGroupGetServerSideProps from '../../../../../utils/generateSignupGroupGetServerSideProps';

const SignupGroupCancelled: NextPage = () => <SignupCancelledPage />;

export const getServerSideProps = generateSignupGroupGetServerSideProps({
  shouldPrefetchPlace: false,
  shouldPrefetchSignupGroup: false,
  translationNamespaces: ['common', 'signup'],
});

export default SignupGroupCancelled;
