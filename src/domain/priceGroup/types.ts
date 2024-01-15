import { OptionType } from '../../types';
import { LocalisedObject, Meta, stringOrNull } from '../api/types';

export type PriceGroup = {
  id: number;
  created_by: stringOrNull;
  created_time: stringOrNull;
  description: LocalisedObject;
  is_free: boolean;
  last_modified_by: stringOrNull;
  last_modified_time: stringOrNull;
  publisher: stringOrNull;
};

export type PriceGroupDense = {
  id: number;
  description: LocalisedObject;
};

export type RegistrationPriceGroup = {
  id: number;
  price_group: PriceGroupDense;
  price: stringOrNull;
  vat_percentage: stringOrNull;
  price_without_vat: stringOrNull;
  vat: stringOrNull;
};

export type PriceGroupsQueryVariables = {
  description?: string;
  isFree?: boolean;
  page?: number;
  pageSize?: number;
  publisher?: string[];
};

export type PriceGroupsResponse = {
  meta: Meta;
  data: PriceGroup[];
};

export type PriceGroupOption = OptionType & { isFree: boolean };
