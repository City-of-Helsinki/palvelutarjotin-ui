import { Button, ButtonVariant } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import EnrolmentError from './EnrolmentError';
import styles from './occurrences.module.scss';
import { enrolButtonColumnWidth } from './OccurrencesTable';
import { getEnrolmentError } from './utils';
import ExternalLink from '../../../common/components/externalLink/ExternalLink';
import {
  EventFieldsFragment,
  OccurrenceFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { formatIntoDate, formatIntoTime } from '../../../utils/time/format';
import { isEnrolmentStarted } from '../../occurrence/utils';
import { EnrolmentType } from '../constants';
import { getEventFields, getEnrolmentType } from '../utils';

type Props = {
  event: EventFieldsFragment;
  value: OccurrenceFieldsFragment;
  selectedOccurrences: string[] | undefined;
  enrolOccurrence: ((id: string) => void) | null;
  selectOccurrence: (id: string) => void;
  deselectOccurrence: (id: string) => void;
  neededOccurrences?: number;
};

const EnrolmentButtonCell: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const {
    autoAcceptance,
    isNotEnrollable,
    enrolmentHasNotStarted,
    externalEnrolmentUrl,
    variant,
    selectionDisabled,
    isSelectedOccurrence,
    hasExternalEnrolment,
    value,
    event,
    neededOccurrences,
    enrolOccurrence,
    deselectOccurrence,
    selectOccurrence,
    getMultipleOccurrencesButtonText,
  } = useEnrolmentButtonUtils(props);

  if (isNotEnrollable) {
    return null;
  }

  // Show error message if enrolment is not available
  const error = getEnrolmentError(value, event);
  if (error) {
    return <EnrolmentError error={error} />;
  }

  if (event.pEvent.enrolmentStart && enrolmentHasNotStarted) {
    return t('enrolment:errors.label.enrolmentStartsAt', {
      date: formatIntoDate(new Date(event.pEvent.enrolmentStart)),
      time: formatIntoTime(new Date(event.pEvent.enrolmentStart)),
    });
  }

  if (hasExternalEnrolment) {
    return (
      <ExternalLink href={externalEnrolmentUrl}>
        {t('occurrence:labelExternalEnrolmentLink')}
      </ExternalLink>
    );
  }

  if (neededOccurrences === 1) {
    const enrolButtonText = t(
      `event:occurrenceList.${
        autoAcceptance ? 'enrolOccurrenceButton' : 'reservationEnquiryButton'
      }`
    );
    return (
      <button
        className={styles[autoAcceptance ? 'enrolButton' : 'enquiryButton']}
        onClick={() => {
          if (enrolOccurrence) {
            enrolOccurrence(value.id);
          }
        }}
      >
        {enrolButtonText}
      </button>
    );
  }

  return (
    <Button
      variant={variant}
      onClick={() =>
        (isSelectedOccurrence ? deselectOccurrence : selectOccurrence)(value.id)
      }
      style={{ width: enrolButtonColumnWidth }}
      disabled={selectionDisabled}
    >
      {getMultipleOccurrencesButtonText()}
    </Button>
  );
};

const useEnrolmentButtonUtils = ({
  value,
  event,
  selectedOccurrences,
  neededOccurrences,
  ...props
}: Props) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const { autoAcceptance } = getEventFields(event, locale);
  const enrolmentType = getEnrolmentType(event.pEvent);
  const isNotEnrollable = enrolmentType === EnrolmentType.Unenrollable;
  const enrolmentHasNotStarted = !isEnrolmentStarted(event);
  const externalEnrolmentUrl = event.pEvent.externalEnrolmentUrl ?? '';
  const hasExternalEnrolment = !!event.pEvent.externalEnrolmentUrl;

  const selectionDisabled =
    selectedOccurrences?.length === neededOccurrences &&
    !selectedOccurrences?.includes(value.id);
  const isSelectedOccurrence = selectedOccurrences?.includes(value.id);
  const variant: ButtonVariant =
    selectionDisabled || isSelectedOccurrence ? 'primary' : 'secondary';

  const getMultipleOccurrencesButtonText = () => {
    // if required amount of occurrences already selected, show disabled button for others
    if (selectionDisabled || isSelectedOccurrence) {
      return t('occurrence:occurrenceSelection.buttonSelectedOccurrences', {
        selectedOccurrences: selectedOccurrences?.length,
        neededOccurrences,
      });
    } else {
      return t(
        `occurrence:occurrenceSelection.${
          autoAcceptance ? 'buttonEnrolOccurrence' : 'reservationEnquiryButton'
        }`
      );
    }
  };

  return {
    getEnrolmentError,
    getMultipleOccurrencesButtonText,
    variant,
    autoAcceptance,
    isNotEnrollable,
    externalEnrolmentUrl,
    selectionDisabled,
    isSelectedOccurrence,
    enrolmentHasNotStarted,
    hasExternalEnrolment,
    value,
    event,
    neededOccurrences,
    ...props,
  };
};

export default EnrolmentButtonCell;
