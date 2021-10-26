import { Button, ButtonVariant } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import ExternalLink from '../../../common/components/externalLink/ExternalLink';
import ErrorMessage from '../../../common/components/form/ErrorMessage';
import {
  EventFieldsFragment,
  OccurrenceFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { formatIntoDate, formatIntoTime } from '../../../utils/time/format';
import { translateValue } from '../../../utils/translateUtils';
import { ENROLMENT_ERRORS } from '../../enrolment/constants';
import {
  isEnrolmentClosed,
  hasOccurrenceSpace,
  isOccurrenceCancelled,
  isEnrolmentStarted,
} from '../../occurrence/utils';
import { EnrolmentType } from '../constants';
import { getEventFields, getEnrolmentType } from '../utils';
import { enrolButtonColumnWidth } from './Occurrences';
import styles from './occurrences.module.scss';

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
    getEnrolmentError,
  } = useEnrolmentButtonUtils(props);

  if (isNotEnrollable) {
    return null;
  }

  // Show error message if enrolment is not available
  const error = getEnrolmentError(value, event);
  if (error) {
    return (
      <ErrorMessage>
        {translateValue('enrolment:errors.label.', error, t)}
      </ErrorMessage>
    );
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

  const getEnrolmentError = (
    occurrence: OccurrenceFieldsFragment,
    event: EventFieldsFragment
  ) => {
    if (isEnrolmentClosed(occurrence, event))
      return ENROLMENT_ERRORS.ENROLMENT_CLOSED_ERROR;
    if (!hasOccurrenceSpace(occurrence))
      return ENROLMENT_ERRORS.NOT_ENOUGH_CAPACITY_ERROR;
    if (isOccurrenceCancelled(occurrence)) {
      return ENROLMENT_ERRORS.ENROLMENT_CANCDELLED_ERROR;
    }
    return null;
  };

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
