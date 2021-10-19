import isFuture from 'date-fns/isFuture';
import isPast from 'date-fns/isPast';
import { TFunction } from 'next-i18next';

import { Registration } from './types';

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
    registration.waiting_attendee_capacity &&
    registration.current_waiting_attendee_count <
      registration.waiting_attendee_capacity
  ) {
    return false;
  } else {
    return true;
  }
};

export const isRegistrationOpen = (registration: Registration): boolean => {
  return (
    isPast(new Date(registration.enrolment_start_time)) &&
    isFuture(new Date(registration.enrolment_end_time))
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
    (registration.waiting_attendee_capacity ?? /* istanbul ignore next */ 0) -
    registration.current_waiting_attendee_count
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
