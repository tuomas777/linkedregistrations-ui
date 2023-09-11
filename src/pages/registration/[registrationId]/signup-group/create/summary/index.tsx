/* eslint-disable max-len */
import { NextPage } from 'next';

import CreateSignupGroupSummaryPage from '../../../../../../domain/signupGroup/summaryPage/SummaryPage';
import generateEnrolmentGetServerSideProps from '../../../../../../utils/generateEnrolmentGetServerSideProps';

const SummaryPage: NextPage = () => <CreateSignupGroupSummaryPage />;

export const getServerSideProps = generateEnrolmentGetServerSideProps({
  shouldPrefetchEnrolment: false,
  shouldPrefetchPlace: true,
  translationNamespaces: ['common', 'enrolment', 'reservation', 'summary'],
});

export default SummaryPage;
