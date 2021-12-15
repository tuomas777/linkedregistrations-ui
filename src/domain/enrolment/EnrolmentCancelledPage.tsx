import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';

import CancelledTemplate from '../../common/components/cancelledTempale/CancelledTemplate';
import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import useLocale from '../../hooks/useLocale';
import MainContent from '../app/layout/mainContent/MainContent';
import { EVENT_INCLUDES } from '../event/constants';
import { useEventQuery } from '../event/query';
import { Event } from '../event/types';
import { getEventFields } from '../event/utils';
import NotFound from '../notFound/NotFound';
import { useRegistrationQuery } from '../registration/query';

type Props = {
  event: Event;
};

const EnrolmentCompletedPage: React.FC<Props> = ({ event }) => {
  const { t } = useTranslation(['enrolment']);
  const locale = useLocale();

  const { name } = getEventFields(event, locale);

  return (
    <MainContent>
      <Head>
        <title>{t('cancelledPage.title')}</title>
      </Head>
      <CancelledTemplate title={t('cancelledPage.title')}>
        <p>{t('cancelledPage.text', { name })}</p>
      </CancelledTemplate>
    </MainContent>
  );
};

const EnrolmentCancelledPageWrapper: React.FC = () => {
  const { query } = useRouter();

  const { data: registration, isLoading: isLoadingRegistration } =
    useRegistrationQuery({ id: query.registrationId as string });

  const { data: event, isLoading: isLoadingEvent } = useEventQuery(
    {
      id: registration?.event as string,
      include: EVENT_INCLUDES,
    },
    { enabled: !!registration?.event }
  );

  return (
    <LoadingSpinner isLoading={isLoadingRegistration || isLoadingEvent}>
      {event ? <EnrolmentCompletedPage event={event} /> : <NotFound />}
    </LoadingSpinner>
  );
};

export default EnrolmentCancelledPageWrapper;
