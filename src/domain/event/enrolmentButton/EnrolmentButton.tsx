import { Button } from 'hds-react';
import React from 'react';

import { useTranslation } from '../../../i18n';
import styles from './enrolmentButton.module.scss';

interface EnrolmentButtonProps {
  neededOccurrences: number | undefined;
  requiredEnrolmentsSelected: boolean;
  enrolOccurrences: () => void;
}

const EnrolmentButton: React.FC<EnrolmentButtonProps> = ({
  requiredEnrolmentsSelected,
  enrolOccurrences,
  neededOccurrences,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.enrolmentButtonWrapper}>
      <Button
        variant="primary"
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
