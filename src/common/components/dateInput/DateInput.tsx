import { DateInput as BaseDateInput, DateInputProps } from 'hds-react';
import React from 'react';

const DateInput: React.FC<DateInputProps> = (props) => {
  return <BaseDateInput {...props} />;
};

export default DateInput;
