import { FieldArray, useField } from 'formik';
import React from 'react';

import { ENROLMENT_FIELDS } from '../../constants';
import { AttendeeFields } from '../../types';
import Attendee from './attendee/Attendee';
import styles from './attendees.module.scss';

const getAttendeePath = (index: number) =>
  `${ENROLMENT_FIELDS.ATTENDEES}[${index}]`;

interface Props {
  formDisabled: boolean;
  readOnly?: boolean;
}

const Attendees: React.FC<Props> = ({ formDisabled, readOnly }) => {
  const [{ value: attendees }] = useField<AttendeeFields[]>({
    name: ENROLMENT_FIELDS.ATTENDEES,
  });

  return (
    <div className={styles.accordions}>
      <FieldArray
        name={ENROLMENT_FIELDS.ATTENDEES}
        render={(arrayHelpers) => (
          <div>
            {attendees.map((attendee, index: number) => {
              return (
                <Attendee
                  key={index}
                  attendee={attendee}
                  attendeePath={getAttendeePath(index)}
                  formDisabled={formDisabled}
                  index={index}
                  onDelete={() => arrayHelpers.remove(index)}
                  readOnly={readOnly}
                  showDelete={attendees.length > 1}
                />
              );
            })}
          </div>
        )}
      />
    </div>
  );
};

export default Attendees;
