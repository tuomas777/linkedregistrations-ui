import { Field, Formik } from 'formik';
import React from 'react';

import { render, screen } from '../../../../utils/testUtils';
import TextInputField, { TextInputFieldProps } from '../TextInputField';

const renderComponent = (props?: Partial<TextInputFieldProps>) =>
  render(
    <Formik initialValues={{ fieldName: '' }} onSubmit={() => undefined}>
      {() => (
        <Field
          name="fieldName"
          component={TextInputField}
          label={'Field label'}
          {...props}
        />
      )}
    </Formik>
  );

test('should characters left text when max length is defined', () => {
  renderComponent({ maxLength: 100 });

  screen.getByText('100 merkkiä jäljellä');
});
