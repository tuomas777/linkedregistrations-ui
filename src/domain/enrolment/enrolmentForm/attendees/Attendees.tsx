import { FieldArray, useField } from 'formik';
import isEqual from 'lodash/isEqual';
import React, { useEffect } from 'react';

import { Registration } from '../../../registration/types';
import { ENROLMENT_FIELDS } from '../../constants';
import { AttendeeFields } from '../../types';
import { getAttendeeDefaultInitialValues } from '../../utils';
import Attendee from './attendee/Attendee';
import styles from './attendees.module.scss';

const getAttendeePath = (index: number) =>
  `${ENROLMENT_FIELDS.ATTENDEES}[${index}]`;

interface Props {
  formDisabled: boolean;
  participantAmount?: number;
  readOnly?: boolean;
  registration: Registration;
}

const Attendees: React.FC<Props> = ({
  formDisabled,
  participantAmount,
  readOnly,
  registration,
}) => {
  const [{ value: attendees }, , { setValue: setAttendees }] = useField<
    AttendeeFields[]
  >({
    name: ENROLMENT_FIELDS.ATTENDEES,
  });

  const attendeeInitialValues = React.useMemo(
    () => getAttendeeDefaultInitialValues(registration),
    [registration]
  );

  useEffect(() => {
    if (participantAmount) {
      if (participantAmount > attendees.length) {
        const newAttendees = [
          ...attendees,
          ...Array(participantAmount - attendees.length).fill(
            attendeeInitialValues
          ),
        ];
        setAttendees(newAttendees);
      } else if (participantAmount < attendees.length) {
        const filledAttendees = attendees.filter(
          (a) => !isEqual(a, attendeeInitialValues)
        );
        const newAttendees = [
          ...filledAttendees,
          ...Array(
            Math.max(participantAmount - filledAttendees.length, 0)
          ).fill(attendeeInitialValues),
        ].slice(0, participantAmount);

        setAttendees(newAttendees);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantAmount]);

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
