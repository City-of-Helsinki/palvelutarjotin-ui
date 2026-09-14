import classNames from 'classnames';
import { IconAngleUp, Button, ButtonSize, ButtonVariant } from 'hds-react';
import { TFunction, useTranslation } from 'next-i18next';
import React from 'react';

import EnrolmentError from './EnrolmentError';
import styles from './occurrences.module.scss';
import { enrolButtonColumnWidth } from './OccurrencesTable';
import { getEnrolmentError } from './utils';
import ExternalLink, {
  getExternalUrl,
} from '../../../common/components/externalLink/ExternalLink';
import {
  EventFieldsFragment,
  OccurrenceFieldsFragment,
} from '../../../generated/graphql';
import type { I18nNamespace } from '../../../types';
import isEmail from '../../../utils/isEmail';
import { formatIntoDate, formatIntoTime } from '../../../utils/time/format';
import { isEnrolmentStarted } from '../../occurrence/utils';

interface Props {
  event: EventFieldsFragment;
  occurrence: OccurrenceFieldsFragment;
  showEnrolmentForm: boolean;
  toggleForm: () => void;
  enrolButtonRef: React.Ref<HTMLButtonElement>;
}

function getExternalEnrolmentHref(externalEnrolmentUrl: string): string {
  if (isEmail(externalEnrolmentUrl)) {
    return `mailto:${externalEnrolmentUrl}`;
  }
  return getExternalUrl(externalEnrolmentUrl);
}

function getEnrolmentButtonLabel(
  t: TFunction,
  showEnrolmentForm: boolean,
  autoAcceptance: boolean | null | undefined
): string {
  if (showEnrolmentForm) {
    return t('enrolment:enrolmentForm.buttonCancelAndCloseForm');
  }
  if (autoAcceptance) {
    return t('event:occurrenceList.enrolOccurrenceButton');
  }
  return t('event:occurrenceList.reservationEnquiryButton');
}

const OccurrenceEnrolmentButton: React.FC<Props> = ({
  event,
  occurrence,
  showEnrolmentForm,
  toggleForm,
  enrolButtonRef,
}) => {
  const { t } = useTranslation<I18nNamespace>();

  const externalEnrolmentUrl = event.pEvent.externalEnrolmentUrl;
  const enrolmentStart = event.pEvent.enrolmentStart;
  const isEnrolmentOpen = isEnrolmentStarted(event);
  const autoAcceptance = event.pEvent?.autoAcceptance;
  const neededOccurrences = event.pEvent.neededOccurrences;
  const enrolmentError = getEnrolmentError(occurrence, event);

  if (enrolmentError) {
    return (
      <div className={styles.enrolmentNotice}>
        <EnrolmentError error={enrolmentError} />
      </div>
    );
  }

  if (externalEnrolmentUrl) {
    return (
      <ExternalLink
        href={getExternalEnrolmentHref(externalEnrolmentUrl)}
        className={styles.externalEnrolmentLink}
      >
        {t('occurrence:labelExternalEnrolmentLink')}
      </ExternalLink>
    );
  }

  if (neededOccurrences === 1 && !isEnrolmentOpen) {
    return (
      <div className={styles.enrolmentNotice}>
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
        size={ButtonSize.Small}
        variant={
          showEnrolmentForm
            ? ButtonVariant.Supplementary
            : ButtonVariant.Primary
        }
        iconEnd={showEnrolmentForm ? <IconAngleUp /> : null}
        onClick={() => toggleForm()}
        aria-expanded={showEnrolmentForm}
        ref={enrolButtonRef}
      >
        {getEnrolmentButtonLabel(t, showEnrolmentForm, autoAcceptance)}
      </Button>
    );
  }

  return null;
};

export default OccurrenceEnrolmentButton;
