import { AxiosError } from 'axios';
import addMinutes from 'date-fns/addMinutes';
import isPast from 'date-fns/isPast';

import { RESERVATION_NAMES } from '../../constants';
import getUnixTime from '../../utils/getUnixTime';
import { callPost } from '../app/axios/axiosClient';
import {
  ENROLMENT_TIME_IN_MINUTES,
  ENROLMENT_TIME_PER_PARTICIPANT_IN_MINUTES,
} from '../enrolment/constants';
import { Registration } from '../registration/types';
import {
  ReserveSeatsInput,
  SeatsReservation,
  SeatsReservationExtended,
  UpdateReserveSeatsInput,
} from './types';

export const reserveSeats = async ({
  registration,
  ...input
}: ReserveSeatsInput): Promise<SeatsReservation> => {
  try {
    const { data } = await callPost(
      `/registration/${registration}/reserve_seats/`,
      JSON.stringify(input)
    );
    return data;
  } catch (error) {
    throw Error(JSON.stringify((error as AxiosError).response?.data));
  }
};

// TODO: Update seats reservation instead of creating new one
// when API supports PUT request
export const updateReserveSeats = async ({
  code,
  registration,
  ...input
}: UpdateReserveSeatsInput): Promise<SeatsReservation> => {
  try {
    const { data } = await callPost(
      `/registration/${registration}/reserve_seats/`,
      JSON.stringify(input)
    );
    return data;
  } catch (error) {
    throw Error(JSON.stringify((error as AxiosError).response?.data));
  }
};

export const getSeatsReservationData = (
  registrationId: string
): SeatsReservationExtended | null => {
  /* istanbul ignore next */
  if (typeof sessionStorage === 'undefined') return null;

  const data = sessionStorage?.getItem(
    `${RESERVATION_NAMES.ENROLMENT_RESERVATION}-${registrationId}`
  );

  return data ? JSON.parse(data) : null;
};

export const setSeatsReservationData = (
  registrationId: string,
  seatsReservation: SeatsReservation
): void => {
  const extendedData: SeatsReservationExtended = {
    ...seatsReservation,
    expires: getSeatsReservationExpirationTime(seatsReservation),
  };

  sessionStorage?.setItem(
    `${RESERVATION_NAMES.ENROLMENT_RESERVATION}-${registrationId}`,
    JSON.stringify(extendedData)
  );
};

// TODO: Remove this when API returns also expiration time
export const getSeatsReservationExpirationTime = (
  seatsReservation: SeatsReservation
) => {
  return getUnixTime(
    addMinutes(
      new Date(seatsReservation.timestamp),
      ENROLMENT_TIME_IN_MINUTES +
        Math.max(seatsReservation.seats - 1, 0) *
          ENROLMENT_TIME_PER_PARTICIPANT_IN_MINUTES
    )
  );
};

export const isSeatsReservationExpired = (data: SeatsReservationExtended) => {
  return isPast(data.expires * 1000);
};

export const getRegistrationTimeLeft = (registration: Registration) => {
  const now = new Date();
  const reservationData = getSeatsReservationData(registration.id);

  return reservationData ? reservationData.expires - getUnixTime(now) : 0;
};
