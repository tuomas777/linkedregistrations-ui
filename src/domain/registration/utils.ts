import isFuture from 'date-fns/isFuture';
import isPast from 'date-fns/isPast';
import { TFunction } from 'next-i18next';

import { getLinkedEventsUrl } from '../../utils/getLinkedEventsPath';
import queryBuilder from '../../utils/queryBuilder';
import {
  Registration,
  RegistrationFields,
  RegistrationQueryVariables,
} from './types';

export const fetchRegistration = (
  args: RegistrationQueryVariables
): Promise<Registration> =>
  fetch(getLinkedEventsUrl(registrationPathBuilder(args))).then((res) =>
    res.json()
  );

export const registrationPathBuilder = (
  args: RegistrationQueryVariables
): string => {
  const { id, include } = args;
  const variableToKeyItems = [
    { key: 'include', value: include },
    { key: 'nocache', value: true },
  ];

  const query = queryBuilder(variableToKeyItems);

  return `/registration/${id}/${query}`;
};

export const isAttenceeCapacityUsed = (registration: Registration): boolean => {
  // If there are seats in the event
  if (!registration.maximum_attendee_capacity) {
    return false;
  } else if (
    registration.current_attendee_count < registration.maximum_attendee_capacity
  ) {
    return false;
  } else {
    return true;
  }
};

export const isWaitingCapacityUsed = (registration: Registration): boolean => {
  // If there are seats in the event
  if (
    registration.waiting_list_capacity &&
    registration.current_waiting_list_count < registration.waiting_list_capacity
  ) {
    return false;
  } else {
    return true;
  }
};

export const isRegistrationOpen = (registration: Registration): boolean => {
  return (
    (!registration.enrolment_start_time ||
      isPast(new Date(registration.enrolment_start_time))) &&
    (!registration.enrolment_end_time ||
      isFuture(new Date(registration.enrolment_end_time)))
  );
};

export const isRegistrationPossible = (registration: Registration): boolean => {
  return (
    isRegistrationOpen(registration) &&
    (!isAttenceeCapacityUsed(registration) ||
      !isWaitingCapacityUsed(registration))
  );
};

export const getFreeWaitingAttendeeCapacity = (
  registration: Registration
): number => {
  return (
    (registration.waiting_list_capacity ?? /* istanbul ignore next */ 0) -
    registration.current_waiting_list_count
  );
};

export const getRegistrationWarning = (
  registration: Registration,
  t: TFunction
): string => {
  if (!isRegistrationPossible(registration)) {
    return t('enrolment:warnings.closed');
  } else if (
    isAttenceeCapacityUsed(registration) &&
    !isWaitingCapacityUsed(registration)
  ) {
    return t('enrolment:warnings.capacityInWaitingList', {
      count: getFreeWaitingAttendeeCapacity(registration),
    });
  }
  return '';
};

export const getRegistrationFields = (
  registration: Registration
): RegistrationFields => {
  return {
    audienceMaxAge: registration.audience_max_age || null,
    audienceMinAge: registration.audience_min_age || null,
    confirmationMessage: registration.confirmation_message,
  };
};
