import { NextPage } from 'next';

import EnrolmentCancelledPage from '../../../../../domain/enrolment/EnrolmentCancelledPage';
import generateSignupGetServerSideProps from '../../../../../utils/generateSignupGetServerSideProps';

const EnrolmentCancelled: NextPage = () => <EnrolmentCancelledPage />;

export const getServerSideProps = generateSignupGetServerSideProps({
  shouldPrefetchPlace: false,
  shouldPrefetchSignup: false,
  translationNamespaces: ['common', 'enrolment'],
});

export default EnrolmentCancelled;
