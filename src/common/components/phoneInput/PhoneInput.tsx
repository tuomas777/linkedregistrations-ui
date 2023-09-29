import { PhoneInput as BasePhoneInput, PhoneInputProps } from 'hds-react';
import React from 'react';

const PhoneInput: React.FC<PhoneInputProps> = (props) => {
  return <BasePhoneInput crossOrigin={undefined} {...props} />;
};

export default PhoneInput;
