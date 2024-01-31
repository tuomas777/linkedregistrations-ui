import { stringOrNull } from '../api/types';

export type Payment = {
  amount: string;
  checkout_url: string;
  created_by?: stringOrNull;
  created_time: stringOrNull;
  external_order_id: string;
  id: number;
  last_modified_by?: stringOrNull;
  last_modified_time: stringOrNull;
  logged_in_checkout_url: string;
  status: string;
};
