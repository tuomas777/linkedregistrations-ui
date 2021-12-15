import { Dialog, IconAlertCircle } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import Button from '../../../common/components/button/Button';
import styles from './modals.module.scss';

export interface ConfirmCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
}

const ConfirmCancelModal: React.FC<ConfirmCancelModalProps> = ({
  isOpen,
  onClose,
  onCancel,
}) => {
  const { t } = useTranslation(['enrolment', 'common']);
  const openConfirmationButtonRef = React.useRef(null);
  const id = 'cancel-confirmation-dialog';
  const titleId = 'cancel-confirmation-dialog-title';
  const descriptionId = 'cancel-confirmation-dialog-description';

  return (
    <Dialog
      id={id}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={styles.dialog}
      isOpen={isOpen}
      focusAfterCloseRef={openConfirmationButtonRef}
      variant="danger"
    >
      <Dialog.Header
        id={titleId}
        title={t('enrolment:cancelEnrolmentModal.title')}
        iconLeft={<IconAlertCircle aria-hidden="true" />}
      />
      <Dialog.Content>
        <p className={styles.warning}>
          <strong>{t('common:warning')}</strong>
        </p>
        <p id={descriptionId}>{t('enrolment:cancelEnrolmentModal.text')} </p>
      </Dialog.Content>
      <Dialog.ActionButtons>
        <Button onClick={onCancel} variant="danger">
          {t('enrolment:cancelEnrolmentModal.buttonCancel')}
        </Button>
        <Button onClick={onClose} theme={'black'} variant="secondary">
          {t('common:cancel')}
        </Button>
      </Dialog.ActionButtons>
    </Dialog>
  );
};

export default ConfirmCancelModal;
