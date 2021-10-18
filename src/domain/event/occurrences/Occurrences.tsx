import classNames from 'classnames';
import isSameDay from 'date-fns/isSameDay';
import {
  Notification,
  IconAngleDown,
  Button,
  IconLocation,
  IconClock,
  IconArrowDown,
  IconGlyphEuro,
} from 'hds-react';
import capitalize from 'lodash/capitalize';
import take from 'lodash/take';
import { TFunction, useTranslation } from 'next-i18next';
import Link from 'next/link';
import React from 'react';

import Table from '../../../common/components/table/Table';
import {
  EventFieldsFragment,
  OccurrenceFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { Language } from '../../../types';
import formatDate from '../../../utils/formatDate';
import formatTimeRange from '../../../utils/formatTimeRange';
import { skipFalsyType } from '../../../utils/typescript.utils';
import OccurrenceGroupInfo from '../../occurrence/occurrenceGroupInfo/OccurrenceGroupInfo';
import OccurrenceGroupLanguageInfo from '../../occurrence/occurrenceGroupInfo/OccurrenceGroupLanguageInfo';
import {
  getAmountOfSeatsLeft,
  isMultidayOccurrence,
} from '../../occurrence/utils';
import PlaceInfo, { PlaceInfoLinks } from '../../place/placeInfo/PlaceInfo';
import PlaceText from '../../place/placeText/PlaceText';
import CalendarButton from '../calendarButton/CalendarButton';
import { EnrolmentType, OCCURRENCE_LIST_PAGE_SIZE } from '../constants';
import DateFilter from '../dateFilter/DateFilter';
import { getEnrolmentType } from '../utils';
import EnrolmentButtonCell from './EnrolmentButtonCell';
import styles from './occurrences.module.scss';
import { useDateFiltering } from './useDateFiltering';

interface Props {
  event: EventFieldsFragment;
  eventLocationId: string;
  occurrences: OccurrenceFieldsFragment[];
  enrolOccurrence: ((id: string) => void) | null;
  selectOccurrence: (id: string) => void;
  deselectOccurrence: (id: string) => void;
  neededOccurrences?: number;
  selectedOccurrences?: string[];
}

export const enrolButtonColumnWidth = '250px';

const Occurrences: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  if (!props.occurrences.length) {
    return (
      <Notification
        label={t('enrolment:occurrenceTable.noOccurrences')}
        type="error"
      />
    );
  }

  return <OccurrencesSection {...props} />;
};

const OccurrencesSection: React.FC<Props> = ({
  event,
  eventLocationId,
  occurrences,
  enrolOccurrence,
  selectOccurrence,
  deselectOccurrence,
  neededOccurrences,
  selectedOccurrences,
}) => {
  const [occurrencesVisible, setOccurrencesVisible] = React.useState(
    OCCURRENCE_LIST_PAGE_SIZE
  );
  const { t } = useTranslation();

  // This hook filters occurrences only by date, rest of the filtering (if added more)
  // could be in this hook but hook name should be changed
  // FIXME: if occurrences is an empty list, useDateFiltering would fail
  // because of index out of bound error.
  const {
    startDate,
    endDate,
    setEndFilterDate,
    setStartFilterDate,
    setInitialDateFilters,
    filteredOccurrences,
    isInitialEndDate,
    isInitialStartDate,
    dateFiltersChanged,
  } = useDateFiltering({ occurrences });

  const showMoreOccurrences = () => {
    setOccurrencesVisible(occurrencesVisible + OCCURRENCE_LIST_PAGE_SIZE);
  };
  const visibleOccurrences = take(filteredOccurrences, occurrencesVisible);
  const showMoreButtonVisible = filteredOccurrences.length > occurrencesVisible;

  return (
    <section className={styles.occurrenceTable}>
      <div className={styles.titleAndFilters}>
        <p className={styles.occurrencesTitle}>
          {t('event:occurrencesTitle', { count: occurrences.length })}{' '}
        </p>
        <div className={styles.dateFilters}>
          <DateFilter
            startDate={startDate}
            endDate={endDate}
            dateFiltersChanged={dateFiltersChanged}
            isInitialStartDate={isInitialStartDate}
            isInitialEndDate={isInitialEndDate}
            setInitialDateFilters={setInitialDateFilters}
            setStartFilterDate={setStartFilterDate}
            setEndFilterDate={setEndFilterDate}
          />
        </div>
      </div>
      <OccurrenceEnrolmentTable
        event={event}
        eventLocationId={eventLocationId}
        enrolOccurrence={enrolOccurrence}
        selectOccurrence={selectOccurrence}
        deselectOccurrence={deselectOccurrence}
        neededOccurrences={neededOccurrences}
        selectedOccurrences={selectedOccurrences}
        filteredOccurrences={visibleOccurrences}
      />
      {showMoreButtonVisible && (
        <div className={styles.loadMoreButtonWrapper}>
          <Button
            onClick={showMoreOccurrences}
            variant="supplementary"
            iconLeft={<IconArrowDown />}
          >
            {t('event:occurrenceList.loadMoreOccurrences')}
          </Button>
        </div>
      )}
    </section>
  );
};

const OccurrenceEnrolmentTable: React.FC<{
  event: EventFieldsFragment;
  eventLocationId: string;
  enrolOccurrence: ((id: string) => void) | null;
  selectOccurrence: (id: string) => void;
  deselectOccurrence: (id: string) => void;
  neededOccurrences?: number;
  selectedOccurrences?: string[];
  filteredOccurrences: OccurrenceFieldsFragment[];
}> = ({
  event,
  eventLocationId,
  enrolOccurrence,
  selectOccurrence,
  deselectOccurrence,
  neededOccurrences,
  selectedOccurrences,
  filteredOccurrences,
}) => {
  const { t } = useTranslation();
  const enrolmentType = getEnrolmentType(event.pEvent);
  const hasInternalEnrolment = enrolmentType === EnrolmentType.Internal;
  const locale = useLocale();
  const columns = [
    {
      Header: t('enrolment:occurrenceTable.columnDate'),
      accessor: (row: OccurrenceFieldsFragment) =>
        formatDate(new Date(row.startTime), 'd.M.yyyy eeeeee', locale),
      id: 'date',
    },
    {
      accessor: (row: OccurrenceFieldsFragment) => {
        return isMultidayOccurrence(row)
          ? null
          : formatTimeRange(
              new Date(row.startTime),
              new Date(row.endTime),
              locale
            );
      },

      id: 'time',
    },
    {
      Header: t('enrolment:occurrenceTable.columnPlace'),
      accessor: (row: OccurrenceFieldsFragment) => {
        const placeId = row.placeId || eventLocationId;
        return placeId ? <PlaceText placeId={placeId} /> : '-';
      },
      id: 'place',
    },
    hasInternalEnrolment && {
      // Keep this column empty if enrolment is done outaside of kultus
      Header: hasInternalEnrolment
        ? t('enrolment:occurrenceTable.columnSeatsInfo')
        : '',
      accessor: (row: OccurrenceFieldsFragment) =>
        `${getAmountOfSeatsLeft(row)} / ${row.amountOfSeats}`,
      id: 'seatsInfo',
    },
    {
      accessor: (row: OccurrenceFieldsFragment) => row,
      Cell: ({ value }: { value: OccurrenceFieldsFragment }) => (
        <EnrolmentButtonCell
          value={value}
          event={event}
          selectedOccurrences={selectedOccurrences}
          neededOccurrences={neededOccurrences}
          enrolOccurrence={enrolOccurrence}
          deselectOccurrence={deselectOccurrence}
          selectOccurrence={selectOccurrence}
        />
      ),
      id: 'enrol',
      style: {
        width: enrolButtonColumnWidth,
      },
    },
    {
      Header: t('enrolment:occurrenceTable.columnAdditionalInfo'),
      accessor: (row: OccurrenceFieldsFragment) => row,
      Cell: ({
        row,
      }: {
        value: OccurrenceFieldsFragment;
        row: {
          getToggleRowExpandedProps: () => React.ComponentProps<'button'>;
          isExpanded: boolean;
        };
      }) => {
        return (
          <button
            aria-label={t('occurrence:showOccurrenceDetails')}
            // row.isExpanded is undefined when is not expanded for some reason
            aria-expanded={row.isExpanded}
            {...row.getToggleRowExpandedProps()}
          >
            <IconAngleDown
              className={classNames(styles.iconAngle, {
                [styles.iconAngleUp]: row.isExpanded,
              })}
            />
          </button>
        );
      },
      style: {
        textAlign: 'center',
        width: '1%',
      },
      id: 'additionalInfo',
    },
  ].filter(skipFalsyType);

  return (
    <Table
      columns={columns}
      data={filteredOccurrences}
      renderExpandedArea={(occurrence: OccurrenceFieldsFragment) => (
        <OccurrenceInfo
          occurrence={occurrence}
          event={event}
          eventLocationId={eventLocationId}
        />
      )}
    />
  );
};

const OccurrenceInfo: React.FC<{
  occurrence: OccurrenceFieldsFragment;
  event: EventFieldsFragment;
  eventLocationId: string;
}> = ({ occurrence, event, eventLocationId }) => {
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

  const getOccurrenceDateTimeString = (
    startDateTime: string,
    endDateTime: string
  ) => {
    const startDate = new Date(startDateTime);
    const endDate = new Date(endDateTime);

    if (!isSameDay(startDate, endDate)) {
      const startDateTimeString = t('occurrence:textDateAndTime', {
        date: capitalize(formatDate(startDate, 'd.M.yyyy', locale)),
        time: formatDate(startDate, 'HH:mm'),
      });
      const endDateTimeString = t('occurrence:textDateAndTime', {
        date: capitalize(formatDate(endDate, 'd.M.yyyy', locale)),
        time: formatDate(endDate, 'HH:mm'),
      });
      return `${startDateTimeString} — ${endDateTimeString}`;
    }

    return t('occurrence:textDateAndTime', {
      date: capitalize(formatDate(startDate, 'EEEE d.M.yyyy', locale)),
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

  const OccurrenceTimeInfoSection = () => (
    <>
      <div>
        <IconClock />
      </div>
      <div>
        <div className={styles.infoTitle}>
          {t('occurrence:dateAndTimeTitle')}
        </div>
        <div>{getOccurrenceDateTimeString(startTime, endTime)}</div>
        {hasInternalEnrolment && (
          <OccurrenceGroupInfo occurrence={occurrence} />
        )}
        <OccurrenceGroupLanguageInfo occurrence={occurrence} />
      </div>
    </>
  );

  const OccurrencePriceInfoSection = () => (
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

  const OccurrenceLocationInfoSection = () => (
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

  const OccurrenceActions = () => (
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
    </>
  );

  return (
    <div className={styles.occurrenceDetails}>
      <div>
        <div className={styles.infoSection}>
          <OccurrenceTimeInfoSection />
        </div>
        <div className={styles.infoSection}>
          <OccurrencePriceInfoSection />
        </div>
        <div className={styles.infoSection}>
          <OccurrenceLocationInfoSection />
        </div>
      </div>
      <div className={styles.occurrenceActions}>
        <OccurrenceActions />
      </div>
    </div>
  );
};

export default Occurrences;
