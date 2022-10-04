import { TFunction } from 'i18next';

import { LEServerError, ServerErrorItem } from '../../../types';
import parseServerErrorMessage from '../../../utils/parseServerErrorMessage';
import pascalCase from '../../../utils/pascalCase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrorObject = Record<string, any>;
type ErrorType = ErrorObject | ErrorObject[] | string;

export const parseEnrolmentServerErrors = ({
  error,
  t,
}: {
  error: ErrorType;
  t: TFunction;
}): ServerErrorItem[] => {
  // LE returns errors as array when trying to create/edit multiple enrolments in same request.
  // In that case call parseEnrolmentServerErrors recursively to get all single errors
  if (Array.isArray(error)) {
    return (error as ErrorObject[]).reduce(
      (previous: ServerErrorItem[], r: ErrorType) => [
        ...previous,
        ...parseEnrolmentServerErrors({ error: r, t }),
      ],
      []
    );
  }

  return typeof error === 'string'
    ? [{ label: '', message: parseServerErrorMessage({ error: [error], t }) }]
    : Object.entries(error).reduce(
        (previous: ServerErrorItem[], [key, error]) => [
          ...previous,
          ...parseEnrolmentServerError({ error, key }),
        ],
        []
      );

  // Get error item for an single error.
  function parseEnrolmentServerError({
    error,
    key,
  }: {
    error: LEServerError;
    key: string;
  }) {
    switch (key) {
      case 'detail':
      case 'non_field_errors':
        return [{ label: '', message: parseServerErrorMessage({ error, t }) }];
      default:
        return [
          {
            label: parseEnrolmentServerErrorLabel({ key }),
            message: parseServerErrorMessage({ error, t }),
          },
        ];
    }
  }

  // Get correct field name for an error item
  function parseEnrolmentServerErrorLabel({ key }: { key: string }): string {
    return t(`enrolment:label${pascalCase(key)}`);
  }
};
