import { FieldArray, useField } from 'formik';
import React from 'react';

import { Registration } from '../../../registration/types';
import { ENROLMENT_FIELDS } from '../../constants';
import { AttendeeFields } from '../../types';
import { updateEnrolmentReservationData } from '../../utils';
import Attendee from './attendee/Attendee';
import styles from './attendees.module.scss';

const getAttendeePath = (index: number) =>
  `${ENROLMENT_FIELDS.ATTENDEES}[${index}]`;

interface Props {
  formDisabled: boolean;
  readOnly?: boolean;
  registration: Registration;
}

const Attendees: React.FC<Props> = ({
  formDisabled,
  readOnly,
  registration,
}) => {
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
                  onDelete={() => {
                    // TODO: Update reservation from API when BE is ready
                    updateEnrolmentReservationData(
                      registration,
                      attendees.length - 1
                    );
                    arrayHelpers.remove(index);
                  }}
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
