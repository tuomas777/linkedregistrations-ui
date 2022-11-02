export type SeatsReservation = {
  code: string;
  expiration: string;
  registration: string;
  seats: number;
  timestamp: string;
};

export type ReserveSeatsInput = {
  registration: string;
  seats: number;
  waitlist: boolean;
};

export type UpdateReserveSeatsInput = { code: string } & ReserveSeatsInput;
