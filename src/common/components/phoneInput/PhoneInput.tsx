import { PhoneInput as BasePhoneInput, PhoneInputProps } from 'hds-react';
import React from 'react';

const PhoneInput: React.FC<PhoneInputProps> = (props) => {
  return <BasePhoneInput {...props} />;
};

export default PhoneInput;
