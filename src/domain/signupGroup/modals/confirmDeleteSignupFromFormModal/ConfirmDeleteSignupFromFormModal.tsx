import { Dialog, IconAlertCircle, IconCross } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '../../../../common/components/button/Button';
import styles from '../../../../common/components/dialog/dialog.module.scss';
import LoadingButton from '../../../../common/components/loadingButton/LoadingButton';

export interface ConfirmDeleteSignupFromFormModalProps {
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onDelete: () => void;
  participantCount: number;
}

const ConfirmDeleteSignupFromFormModal: React.FC<
  ConfirmDeleteSignupFromFormModalProps
> = ({ isOpen, isSaving, onClose, onDelete, participantCount }) => {
  const { t } = useTranslation(['enrolment', 'common']);

  const handleClose = (event?: React.MouseEvent | React.KeyboardEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    onClose();
  };

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    onDelete();
  };

  const id = 'confirm-participant-delete-modal';
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;

  return (
    <Dialog
      id={id}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={styles.dialog}
      isOpen={isOpen}
      variant="danger"
    >
      <Dialog.Header
        id={titleId}
        iconLeft={<IconAlertCircle aria-hidden={true} />}
        title={t('enrolment:deleteSignupFromFormModal.title', {
          count: participantCount,
        })}
      />
      <Dialog.Content>
        <p className={styles.warning}>
          <strong>{t('common:warning')}</strong>
        </p>
        <p id={descriptionId}>
          {t('enrolment:deleteSignupFromFormModal.text1', {
            count: participantCount,
          })}
        </p>
        <p>{t('enrolment:deleteSignupFromFormModal.text2')}</p>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <LoadingButton
          disabled={isSaving}
          icon={<IconCross aria-hidden={true} />}
          loading={isSaving}
          onClick={handleDelete}
          type="button"
          variant="danger"
        >
          {t('enrolment:deleteSignupFromFormModal.buttonDelete', {
            count: participantCount,
          })}
        </LoadingButton>
        <Button
          disabled={isSaving}
          onClick={handleClose}
          theme="black"
          type="button"
          variant="secondary"
        >
          {t('common:cancel')}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

export default ConfirmDeleteSignupFromFormModal;
