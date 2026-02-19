import classNames from 'classnames';
import { Notification, Button, ButtonVariant, IconAngleUp } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import styles from './eventPage.module.scss';
import EnrolmentFormSection from './occurrences/EnrolmentFormSection';
import {
  EventFieldsFragment,
  OccurrenceFieldsFragment,
} from '../../generated/graphql';

export const EnrolmentFormContainer: React.FC<{
  neededOccurrences?: number;
  showEnrolmentForm: boolean;
  selectedOccurrences: string[];
  setShowEnrolmentForm: (a: boolean) => void;
  event: EventFieldsFragment;
  occurrences?: OccurrenceFieldsFragment[];
  handleOnEnrol: () => void;
}> = ({
  neededOccurrences,
  showEnrolmentForm,
  selectedOccurrences,
  setShowEnrolmentForm,
  event,
  occurrences,
  handleOnEnrol,
}) => {
  const { t } = useTranslation();
  const enrolmentFormRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    enrolmentFormRef.current?.scrollIntoView?.({ behavior: 'smooth' });
  }, [showEnrolmentForm]);

  return (
    <div className={styles.enrolmentFormContainer}>
      {showEnrolmentForm &&
        selectedOccurrences.length !== neededOccurrences && (
          <Notification
            style={{ marginTop: 'var(--spacing-xl)' }}
            label={t('enrolment:enrolmentForm.labelChooseRequiredOccurrences', {
              amount: neededOccurrences,
            })}
            type="alert"
          >
            {t('enrolment:enrolmentForm.descriptionChooseRequiredOccurrences')}
          </Notification>
        )}
      <div
        className={classNames(styles.enrolmentFormSection, {
          [styles.hideEnrolmentForm]:
            selectedOccurrences.length !== neededOccurrences,
        })}
        ref={enrolmentFormRef}
      >
        <Button
          className={styles.cancelEnrolmentButton}
          variant={ButtonVariant.Supplementary}
          iconEnd={<IconAngleUp />}
          onClick={() => setShowEnrolmentForm(false)}
        >
          {t('enrolment:enrolmentForm.buttonCancelAndCloseForm')}
        </Button>
        <EnrolmentFormSection
          event={event}
          occurrences={
            occurrences?.filter((o) => selectedOccurrences.includes(o.id)) ?? []
          }
          onCloseForm={() => setShowEnrolmentForm(false)}
          onEnrol={handleOnEnrol}
        />
      </div>
    </div>
  );
};
