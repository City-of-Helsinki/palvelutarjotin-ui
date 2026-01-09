import { Button, ButtonVariant } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import styles from './enrolmentButton.module.scss';
import type { I18nNamespace } from '../../../types';

interface EnrolmentButtonProps {
  neededOccurrences?: number;
  requiredEnrolmentsSelected: boolean;
  enrolOccurrences: () => void;
}

const EnrolmentButton: React.FC<EnrolmentButtonProps> = ({
  requiredEnrolmentsSelected,
  enrolOccurrences,
  neededOccurrences,
}) => {
  const { t } = useTranslation<I18nNamespace>();

  return (
    <div className={styles.enrolmentButtonWrapper}>
      <Button
        variant={ButtonVariant.Primary}
        disabled={!requiredEnrolmentsSelected}
        style={{
          color: !requiredEnrolmentsSelected ? 'black' : undefined,
        }}
        onClick={requiredEnrolmentsSelected ? enrolOccurrences : undefined}
      >
        {requiredEnrolmentsSelected
          ? t('event:occurrenceList.enrolOccurrenceButton')
          : t('occurrence:occurrenceSelection.buttonSelectOccurrences', {
              neededOccurrences,
            })}
      </Button>
    </div>
  );
};

export default EnrolmentButton;
