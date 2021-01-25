import { useFormikContext } from 'formik';
import { Notification } from 'hds-react';
import * as React from 'react';

import { useTranslation } from '../../../i18n';
import styles from './errorMessage.module.scss';
import { doFocus as focusToFirstError } from './FocusToFirstError';

const FormErrorNotification: React.FC<{
  errors: string[];
  visible: boolean;
}> = ({ errors, visible }) => {
  const { t } = useTranslation();
  const { submitCount } = useFormikContext();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const tabUsed = React.useRef<boolean>(false);

  React.useEffect(() => {
    containerRef.current?.focus();
    tabUsed.current = false;
  }, [submitCount]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Tab' && !e.shiftKey) {
      const focused = focusToFirstError();
      if (focused) {
        e.preventDefault();
      }
    }
  };

  // Focus first error element after tabbing from notification
  const handleOnBlur = () => {
    if (tabUsed.current) {
      focusToFirstError();
    }
  };

  return visible ? (
    <div
      className={styles.errorNotificationContainer}
      role="alert"
      tabIndex={-1}
      ref={containerRef}
      key={submitCount}
      onBlur={handleOnBlur}
      onKeyDown={handleKeyDown}
    >
      <Notification label={t('form:errorNotification.title')} type="error">
        {t('form:errorNotification.listTitle')}
        <ul>
          {errors.map((error) => (
            <li key={error}>{t(error)}</li>
          ))}
        </ul>
      </Notification>
    </div>
  ) : null;
};

export default FormErrorNotification;
