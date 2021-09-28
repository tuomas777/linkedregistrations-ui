import { TextArea as BaseTextArea, TextAreaProps } from 'hds-react';
import React from 'react';

const TextArea: React.FC<TextAreaProps> = (props) => {
  return <BaseTextArea {...props} />;
};

export default TextArea;
