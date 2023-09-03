/* eslint-disable max-len */
import { NextPage } from 'next';

import EditSignupPage from '../../../../../../domain/signup/EditSignupPage';
import generateSignupGetServerSideProps from '../../../../../../utils/generateSignupGetServerSideProps';

const EditSignup: NextPage = () => <EditSignupPage />;

export const getServerSideProps = generateSignupGetServerSideProps({
  shouldPrefetchPlace: false,
  shouldPrefetchSignup: true,
  translationNamespaces: ['common', 'enrolment'],
});

export default EditSignup;
