import { NextPage } from 'next';

import CreateSignupGroupPage from '../../../../../domain/signupGroup/CreateSignupGroupPage';
import generateSignupGetServerSideProps from '../../../../../utils/generateSignupGetServerSideProps';

const CreateSignupGroup: NextPage = () => <CreateSignupGroupPage />;

export const getServerSideProps = generateSignupGetServerSideProps({
  shouldPrefetchPlace: true,
  shouldPrefetchSignup: false,
  translationNamespaces: ['common', 'enrolment', 'reservation'],
});

export default CreateSignupGroup;
