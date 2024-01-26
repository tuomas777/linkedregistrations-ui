import { NextParsedUrlQuery } from 'next/dist/server/request-meta';

const getStringValueFromQuery = (
  query: NextParsedUrlQuery,
  key: string
): string => {
  const value = query[key];
  return (Array.isArray(value) ? value[0] : value) ?? '';
};

export default getStringValueFromQuery;
