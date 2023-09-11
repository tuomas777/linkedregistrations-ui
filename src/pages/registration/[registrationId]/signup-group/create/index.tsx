import { NextPage } from 'next';

import CreateSignupGroupPage from '../../../../../domain/signupGroup/CreateSignupGroupPage';
import generateEnrolmentGetServerSideProps from '../../../../../utils/generateEnrolmentGetServerSideProps';

const CreateSignupGroup: NextPage = () => <CreateSignupGroupPage />;

export const getServerSideProps = generateEnrolmentGetServerSideProps({
  shouldPrefetchEnrolment: false,
  shouldPrefetchPlace: true,
  translationNamespaces: ['common', 'enrolment', 'reservation'],
});

export default CreateSignupGroup;
