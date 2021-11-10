import classNames from 'classnames';
import { isSameDay } from 'date-fns';
import {
  IconAngleUp,
  Button,
  IconLocation,
  IconClock,
  IconGlyphEuro,
} from 'hds-react';
import { capitalize } from 'lodash';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';

import {
  OccurrenceFieldsFragment,
  EventFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import formatTimeRange from '../../../utils/formatTimeRange';
import {
  formatIntoDate,
  formatIntoTime,
  formatLocalizedDate,
  DATE_FORMAT,
} from '../../../utils/time/format';
import OccurrenceGroupInfo from '../../occurrence/occurrenceGroupInfo/OccurrenceGroupInfo';
import OccurrenceGroupLanguageInfo from '../../occurrence/occurrenceGroupInfo/OccurrenceGroupLanguageInfo';
import PlaceInfo, { PlaceInfoLinks } from '../../place/placeInfo/PlaceInfo';
import CalendarButton from '../calendarButton/CalendarButton';
import { EnrolmentType } from '../constants';
import { getEnrolmentType } from '../utils';
import EnrolmentFormSection from './EnrolmentFormSection';
import styles from './occurrences.module.scss';
import { enrolButtonColumnWidth } from './OccurrencesTable';

const OccurrenceInfo: React.FC<{
  occurrence: OccurrenceFieldsFragment;
  event: EventFieldsFragment;
  eventLocationId: string;
}> = ({ occurrence, event, eventLocationId }) => {
  const [showEnrolmentForm, setShowEnrolmentForm] = React.useState(false);
  const enrolmentFormRef = React.useRef<HTMLDivElement>(null);
  const enrolButtonRef = React.useRef<HTMLButtonElement>(null);
  const { placeId, startTime, endTime } = occurrence;
  const { t } = useTranslation();
  const locale = useLocale();
  const enrolmentType = getEnrolmentType(event.pEvent);
  const hasInternalEnrolment = enrolmentType === EnrolmentType.Internal;
  const offer = event?.offers?.[0];
  const price = offer?.price?.[locale];
  const priceDescription = offer?.description?.[locale];
  const isFree = offer?.isFree ?? !price;
  const priceInfoUrl = offer?.infoUrl?.[locale];
  const neededOccurrences = event.pEvent.neededOccurrences;
  const autoAcceptance = event.pEvent?.autoAcceptance;

  React.useEffect(() => {
    if (showEnrolmentForm) {
      enrolmentFormRef.current?.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [showEnrolmentForm]);

  const toggleForm = () => {
    setShowEnrolmentForm((showEnrolmentForm) => !showEnrolmentForm);
  };

  const handleCloseForm = () => {
    setShowEnrolmentForm(false);
    enrolButtonRef.current?.focus();
  };

  const getOccurrenceDateTimeString = () => {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (!isSameDay(startDate, endDate)) {
      const startDateTimeString = t('occurrence:textDateAndTime', {
        date: capitalize(formatIntoDate(startDate)),
        time: formatIntoTime(startDate),
      });
      const endDateTimeString = t('occurrence:textDateAndTime', {
        date: capitalize(formatIntoDate(endDate)),
        time: formatIntoTime(endDate),
      });
      return `${startDateTimeString} — ${endDateTimeString}`;
    }

    return t('occurrence:textDateAndTime', {
      date: capitalize(
        formatLocalizedDate(startDate, `EEEE ${DATE_FORMAT}`, locale)
      ),
      time: formatTimeRange(startDate, endDate, locale),
    });
  };

  const createLink = (prefix: string, url: string) => (
    <>
      {prefix}
      {prefix && ' '}
      <a href={url} rel="noopener noreferrer" target="_blank">
        {url}
      </a>
    </>
  );

  const occurrenceTimeInfoSection = () => (
    <>
      <div>
        <IconClock />
      </div>
      <div>
        <div className={styles.infoTitle}>
          {t('occurrence:dateAndTimeTitle')}
        </div>
        <div>{getOccurrenceDateTimeString()}</div>
        {hasInternalEnrolment && (
          <OccurrenceGroupInfo occurrence={occurrence} />
        )}
        <OccurrenceGroupLanguageInfo occurrence={occurrence} />
      </div>
    </>
  );

  const occurrencePriceInfoSection = () => (
    <>
      <div>
        <IconGlyphEuro />
      </div>
      <div>
        <div className={styles.infoTitle}>
          <div data-testid="event-price">
            {isFree ? t('event:occurrenceList.eventIsFree') : price}
          </div>
        </div>
        {!!priceDescription && (
          <p data-testid="event-priceDescription">{priceDescription}</p>
        )}
        {!!priceInfoUrl && (
          <p data-testid="event-priceInfoUrl">{createLink('', priceInfoUrl)}</p>
        )}
      </div>
    </>
  );

  const occurrenceLocationInfoSection = () => (
    <>
      <div>
        <IconLocation />
      </div>
      <div>
        <div className={styles.infoTitle}>{t('event:location.title')}</div>
        <PlaceInfo
          id={placeId || eventLocationId}
          language={locale}
          showVenueInfo
        />
      </div>
    </>
  );

  const occurrenceActions = () => (
    <>
      {/* TODO: functionality for these buttons */}
      <CalendarButton event={event} occurrence={occurrence} />
      <Link href={`/?places=${placeId || eventLocationId}`} passHref>
        <Button iconLeft={<IconLocation />} variant="supplementary">
          {t('event:occurrenceList.showAllLocationEvents')}
        </Button>
      </Link>
      {/* Move map links down a bit show they would be 
      closer to location info shown in left column  */}
      <div style={{ height: '50px' }} />
      <PlaceInfoLinks
        id={placeId || eventLocationId}
        language={locale}
        variant="button"
      />
      {neededOccurrences === 1 && (
        <Button
          className={classNames(styles.expandEnrolButton, {
            [styles.enquiryButton]: !showEnrolmentForm && !autoAcceptance,
            [styles.enrolButton]: autoAcceptance,
          })}
          style={{ width: enrolButtonColumnWidth }}
          size="small"
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
      )}
    </>
  );

  return (
    <div>
      <div className={styles.occurrenceDetails}>
        <div>
          <div className={styles.infoSection}>
            {occurrenceTimeInfoSection()}
          </div>
          <div className={styles.infoSection}>
            {occurrencePriceInfoSection()}
          </div>
          <div className={styles.infoSection}>
            {occurrenceLocationInfoSection()}
          </div>
        </div>
        <div className={styles.occurrenceActions}>{occurrenceActions()}</div>
      </div>
      {showEnrolmentForm && (
        <div className={styles.enrolmentFormSection} ref={enrolmentFormRef}>
          <EnrolmentFormSection
            event={event}
            occurrences={[occurrence]}
            onCloseForm={handleCloseForm}
          />
        </div>
      )}
    </div>
  );
};

export default OccurrenceInfo;
