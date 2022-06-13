import { NumberInput as BaseNumberInput, NumberInputProps } from 'hds-react';
import React from 'react';

const NumberInput: React.FC<NumberInputProps> = (props) => {
  return <BaseNumberInput {...props} />;
};

export default NumberInput;
