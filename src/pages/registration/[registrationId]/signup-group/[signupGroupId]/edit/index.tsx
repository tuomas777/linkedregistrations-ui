/* eslint-disable max-len */
import { NextPage } from 'next';

import EditSignupGroupPage from '../../../../../../domain/signupGroup/EditSignupGroupPage';
import generateSignupGroupGetServerSideProps from '../../../../../../utils/generateSignupGroupGetServerSideProps';

const EditSignupGroup: NextPage = () => <EditSignupGroupPage />;

export const getServerSideProps = generateSignupGroupGetServerSideProps({
  shouldPrefetchPlace: false,
  shouldPrefetchSignupGroup: true,
  translationNamespaces: ['common', 'signup'],
});

export default EditSignupGroup;
