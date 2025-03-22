import { useFormikContext } from 'formik';
import { Notification } from 'hds-react';
import { useTranslation } from 'next-i18next';
import * as React from 'react';

import styles from './errorMessage.module.scss';
import { doFocus as focusToFirstError } from './FocusToFirstError';

const FormErrorNotification: React.FC<{
  errors: string[];
  visible: boolean;
}> = ({ errors, visible }) => {
  const { t } = useTranslation();
  const { submitCount, isSubmitting } = useFormikContext();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const tabUsed = React.useRef<boolean>(false);

  React.useEffect(() => {
    // Focus only after submitting is done (after that errors are available)
    if (submitCount && !isSubmitting) {
      containerRef.current?.focus();
    }
    tabUsed.current = false;
  }, [submitCount, isSubmitting]);

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
    // FIXME: Make component accessible and re-enable linting
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
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
