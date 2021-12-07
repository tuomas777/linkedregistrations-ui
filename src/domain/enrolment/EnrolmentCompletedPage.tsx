import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import React from 'react';

import LoadingSpinner from '../../common/components/loadingSpinner/LoadingSpinner';
import SuccessTemplate from '../../common/components/successTemplate/SuccessTemplate';
import useLocale from '../../hooks/useLocale';
import MainContent from '../app/layout/mainContent/MainContent';
import { EVENT_INCLUDES } from '../event/constants';
import { useEventQuery } from '../event/query';
import { Event } from '../event/types';
import { getEventFields } from '../event/utils';
import NotFound from '../notFound/NotFound';
import { useRegistrationQuery } from '../registration/query';
import { Registration } from '../registration/types';
import { getRegistrationFields } from '../registration/utils';
import ConfirmationMessage from './confirmationMessage/ConfirmationMessage';

type Props = {
  event: Event;
  registration: Registration;
};

const EnrolmentCompletedPage: React.FC<Props> = ({ event, registration }) => {
  const { t } = useTranslation(['enrolment']);
  const locale = useLocale();

  const { name } = getEventFields(event, locale);
  const { confirmationMessage } = getRegistrationFields(registration);

  return (
    <MainContent>
      <SuccessTemplate title={t('completedPage.title')}>
        {confirmationMessage ? (
          <ConfirmationMessage registration={registration} />
        ) : (
          <p>{t('completedPage.text', { name })}</p>
        )}
      </SuccessTemplate>
    </MainContent>
  );
};

const EnrolmentCompletedPageWrapper: React.FC = () => {
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
      {registration && event ? (
        <EnrolmentCompletedPage event={event} registration={registration} />
      ) : (
        <NotFound />
      )}
    </LoadingSpinner>
  );
};

export default EnrolmentCompletedPageWrapper;
