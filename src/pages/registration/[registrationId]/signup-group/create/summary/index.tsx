/* eslint-disable max-len */
import { NextPage } from 'next';

import CreateSignupGroupSummaryPage from '../../../../../../domain/signupGroup/summaryPage/SummaryPage';
import generateSignupGetServerSideProps from '../../../../../../utils/generateSignupGetServerSideProps';

const SummaryPage: NextPage = () => <CreateSignupGroupSummaryPage />;

export const getServerSideProps = generateSignupGetServerSideProps({
  shouldPrefetchPlace: true,
  shouldPrefetchSignup: false,
  translationNamespaces: ['common', 'enrolment', 'reservation', 'summary'],
});

export default SummaryPage;
