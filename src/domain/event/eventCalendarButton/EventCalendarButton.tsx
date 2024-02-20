import { ButtonProps, ButtonVariant, IconCalendar } from 'hds-react';
import { useTranslation } from 'next-i18next';
import { FC, MouseEventHandler } from 'react';

import Button from '../../../common/components/button/Button';
import { useNotificationsContext } from '../../../common/components/notificationsContext/hooks/useNotificationsContext';
import useLocale from '../../../hooks/useLocale';
import { Event } from '../types';
import { downloadEventIcsFile } from '../utils';

export type EventCalendarButtonProps = {
  event: Event;
  onClick?: MouseEventHandler<HTMLButtonElement>;
} & Omit<ButtonProps, 'children' | 'onClick'>;

const EventCalendarButton: FC<EventCalendarButtonProps> = ({
  event,
  onClick,
  variant = 'secondary',
  ...rest
}) => {
  const locale = useLocale();
  const { t } = useTranslation('common');
  const { addNotification } = useNotificationsContext();

  const handleClick: MouseEventHandler<HTMLButtonElement> = (ev) => {
    if (onClick) {
      onClick(ev);
    } else {
      downloadEventIcsFile({ addNotification, event, locale, t });
    }
  };

  return (
    <Button
      {...rest}
      iconLeft={<IconCalendar aria-hidden />}
      onClick={handleClick}
      variant={variant as Exclude<ButtonVariant, 'supplementary'>}
    >
      {t('common:eventCalendarButton.label')}
    </Button>
  );
};

export default EventCalendarButton;
