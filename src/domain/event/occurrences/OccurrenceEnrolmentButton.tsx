import classNames from 'classnames';
import { IconAngleUp, Button } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ExternalLink from '../../../common/components/externalLink/ExternalLink';
import {
  EventFieldsFragment,
  OccurrenceFieldsFragment,
} from '../../../generated/graphql';
import { formatIntoDate, formatIntoTime } from '../../../utils/time/format';
import { isEnrolmentStarted } from '../../occurrence/utils';
import EnrolmentError from './EnrolmentError';
import styles from './occurrences.module.scss';
import { enrolButtonColumnWidth } from './OccurrencesTable';
import { getEnrolmentError } from './utils';

interface Props {
  event: EventFieldsFragment;
  occurrence: OccurrenceFieldsFragment;
  showEnrolmentForm: boolean;
  toggleForm: () => void;
  enrolButtonRef: React.Ref<HTMLButtonElement>;
}

const OccurrenceEnrolmentButton: React.FC<Props> = ({
  event,
  occurrence,
  showEnrolmentForm,
  toggleForm,
  enrolButtonRef,
}) => {
  const { t } = useTranslation();

  const externalEnrolmentUrl = event.pEvent.externalEnrolmentUrl;
  const enrolmentStart = event.pEvent.enrolmentStart;
  const isEnrolmentOpen = isEnrolmentStarted(event);
  const autoAcceptance = event.pEvent?.autoAcceptance;
  const neededOccurrences = event.pEvent.neededOccurrences;
  const enrolmentError = getEnrolmentError(occurrence, event);

  if (enrolmentError) {
    return <EnrolmentError error={enrolmentError} />;
  }

  if (externalEnrolmentUrl) {
    return (
      <ExternalLink
        href={externalEnrolmentUrl}
        className={styles.externalEnrolmentLink}
      >
        {t('occurrence:labelExternalEnrolmentLink')}
      </ExternalLink>
    );
  }

  if (neededOccurrences === 1 && !isEnrolmentOpen) {
    return (
      <div className={styles.enrolmentStartNotice}>
        {t('event:occurrenceList.enrolmentStartsAt', {
          date: formatIntoDate(new Date(enrolmentStart)),
          time: formatIntoTime(new Date(enrolmentStart)),
        })}
      </div>
    );
  }

  if (neededOccurrences === 1) {
    return (
      <Button
        className={classNames(styles.expandEnrolButton, {
          [styles.enquiryButton]: !showEnrolmentForm && !autoAcceptance,
          [styles.enrolButton]: autoAcceptance,
        })}
        style={{ width: enrolButtonColumnWidth }}
        size="small"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        variant={showEnrolmentForm ? ('supplementary' as any) : 'primary'}
        iconRight={showEnrolmentForm ? <IconAngleUp /> : null}
        onClick={() => toggleForm()}
        aria-expanded={showEnrolmentForm}
        ref={enrolButtonRef}
      >
        {showEnrolmentForm
          ? t('enrolment:enrolmentForm.buttonCancelAndCloseForm')
          : t(
              `event:occurrenceList.${
                autoAcceptance
                  ? 'enrolOccurrenceButton'
                  : 'reservationEnquiryButton'
              }`
            )}
      </Button>
    );
  }

  return null;
};

export default OccurrenceEnrolmentButton;
