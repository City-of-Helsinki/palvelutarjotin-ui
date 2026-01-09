import { Button, ButtonVariant, IconAngleUp } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import styles from './eventPage.module.scss';
import QueueFormSection from './occurrences/QueueFormSection';
import { EventFieldsFragment } from '../../generated/graphql';

export const QueueFormContainer: React.FC<{
  showQueueForm: boolean;
  setShowQueueForm: (a: boolean) => void;
  event: EventFieldsFragment;
  handleOnQueue: () => void;
}> = ({ showQueueForm, setShowQueueForm, event, handleOnQueue }) => {
  const { t } = useTranslation();
  const queueFormRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    queueFormRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [showQueueForm]);

  return (
    <>
      <h2 className={styles.enrolmentHeader}>{t('enrolment:queue.title')}</h2>
      {showQueueForm ? (
        <div className={styles.enrolmentFormContainer}>
          <div className={styles.enrolmentFormSection} ref={queueFormRef}>
            <div className={styles.closeQueueFormButtonWrapper}>
              <div className={styles.enrolmentText}>
                {t('enrolment:queue.enrolText')}
              </div>
              <Button
                variant={ButtonVariant.Supplementary}
                iconEnd={<IconAngleUp />}
                onClick={() => setShowQueueForm(false)}
              >
                {t('enrolment:enrolmentForm.buttonCancelAndCloseForm')}
              </Button>
            </div>
            <QueueFormSection
              event={event}
              onCloseForm={() => setShowQueueForm(false)}
              onQueue={handleOnQueue}
            />
          </div>
        </div>
      ) : (
        <div className={styles.queueInfoContainer}>
          <div className={styles.enrolmentText}>
            {t('enrolment:queue.enrolText')}
          </div>
          <Button onClick={() => setShowQueueForm(true)}>
            {t('enrolment:queue.enrol')}
          </Button>
        </div>
      )}
    </>
  );
};
