export type Language = 'en' | 'fi' | 'sv';

export type Error<T> = {
  key: string;
} & T;

export type OptionType = {
  label: string;
  value: string;
};

export type LEServerError =
  | string
  | Record<string, unknown>
  | Array<Record<string, unknown> | string>;

export type ServerErrorItem = {
  label: string;
  message: string;
};
