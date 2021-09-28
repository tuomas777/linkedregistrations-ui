import { FieldProps, useField } from 'formik';
import { DateInputProps } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { getErrorText } from '../../../utils/validationUtils';
import DateInput from '../dateInput/DateInput';

type Props = FieldProps & DateInputProps;

const DateInputField: React.FC<Props> = ({
  field: { name, value, ...field },
  form,
  ...rest
}) => {
  const { t } = useTranslation();
  const [, { touched, error }] = useField(name);

  const errorText = getErrorText(error, touched, t);

  return (
    <DateInput
      {...rest}
      {...field}
      id={name}
      name={name}
      value={value}
      errorText={errorText}
      invalid={Boolean(errorText)}
    />
  );
};

export default DateInputField;
