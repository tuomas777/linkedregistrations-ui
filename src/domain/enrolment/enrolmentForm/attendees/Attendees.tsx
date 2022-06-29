import { FieldArray, useField } from 'formik';
import React, { useState } from 'react';

import { Registration } from '../../../registration/types';
import { ENROLMENT_FIELDS } from '../../constants';
import ConfirmDeleteParticipantModal from '../../modals/confirmDeleteParticipantModal/ConfirmDeleteParticipantModal';
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
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

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
              const closeModal = () => {
                setOpenModalIndex(null);
              };

              const openModal = () => {
                setOpenModalIndex(index);
              };

              const deleteParticipant = () => {
                setSaving(true);

                // TODO: Update reservation from API when BE is ready
                updateEnrolmentReservationData(
                  registration,
                  attendees.length - 1
                );
                arrayHelpers.remove(index);

                setSaving(false);
                closeModal();
              };

              return (
                <React.Fragment key={index}>
                  <ConfirmDeleteParticipantModal
                    isOpen={openModalIndex === index}
                    isSaving={saving}
                    onClose={closeModal}
                    onDelete={deleteParticipant}
                    participantCount={1}
                  />
                  <Attendee
                    key={index}
                    attendee={attendee}
                    attendeePath={getAttendeePath(index)}
                    formDisabled={formDisabled}
                    index={index}
                    onDelete={openModal}
                    readOnly={readOnly}
                    showDelete={attendees.length > 1}
                  />
                </React.Fragment>
              );
            })}
          </div>
        )}
      />
    </div>
  );
};

export default Attendees;
