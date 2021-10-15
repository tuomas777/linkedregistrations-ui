import { Field, Formik } from 'formik';
import React from 'react';

import { render, screen } from '../../../../utils/testUtils';
import TextAreaField, { TextAreaFieldProps } from '../TextAreaField';

const renderComponent = (props?: Partial<TextAreaFieldProps>) =>
  render(
    <Formik initialValues={{ fieldName: '' }} onSubmit={() => undefined}>
      {() => (
        <Field
          name="fieldName"
          component={TextAreaField}
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
