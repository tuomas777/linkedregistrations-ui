import { Field, Formik } from 'formik';
import range from 'lodash/range';
import React from 'react';

import { render, screen, userEvent } from '../../../../utils/testUtils';
import CheckboxGroupField, {
  CheckboxGroupFieldProps,
} from '../CheckboxGroupField';

const renderComponent = (props?: Partial<CheckboxGroupFieldProps>) =>
  render(
    <Formik initialValues={{ fieldName: '' }} onSubmit={() => undefined}>
      {() => (
        <Field
          name="fieldName"
          component={CheckboxGroupField}
          label={'Field label'}
          options={[]}
          {...props}
        />
      )}
    </Formik>
  );

test('should toggle visible options', () => {
  const visibleOptionAmount = 5;
  const options = range(1, visibleOptionAmount * 2).map((index) => ({
    label: `Option ${index}`,
    value: index.toString(),
  }));

  renderComponent({ options, visibleOptionAmount });
  const defaultOptions = options.slice(0, visibleOptionAmount);
  const restOptions = options.slice(visibleOptionAmount);

  defaultOptions.forEach(({ label }) => {
    expect(screen.queryByLabelText(label)).toBeInTheDocument();
  });

  restOptions.forEach(({ label }) => {
    expect(screen.queryByLabelText(label)).not.toBeInTheDocument();
  });

  userEvent.click(screen.getByRole('button', { name: /näytä lisää/i }));

  restOptions.forEach(({ label }) => {
    expect(screen.queryByLabelText(label)).toBeInTheDocument();
  });
});
