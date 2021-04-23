import classNames from 'classnames';
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
import Link from 'next/link';
import React from 'react';

import ErrorMessage from '../../../common/components/form/ErrorMessage';
import Table from '../../../common/components/table/Table';
import {
  EventFieldsFragment,
  OccurrenceFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import { useTranslation } from '../../../i18n';
import formatDate from '../../../utils/formatDate';
import formatTimeRange from '../../../utils/formatTimeRange';
import { translateValue } from '../../../utils/translateUtils';
import { ENROLMENT_ERRORS } from '../../enrolment/constants';
import OccurrenceGroupInfo from '../../occurrence/occurrenceGroupInfo/OccurrenceGroupInfo';
import OccurrenceGroupLanguageInfo from '../../occurrence/occurrenceGroupInfo/OccurrenceGroupLanguageInfo';
import {
  getAmountOfSeatsLeft,
  hasOccurrenceSpace,
  isEnrolmentClosed,
  isEnrolmentStarted,
} from '../../occurrence/utils';
import PlaceInfo, { PlaceInfoLinks } from '../../place/placeInfo/PlaceInfo';
import PlaceText from '../../place/placeText/PlaceText';
import CalendarButton from '../calendarButton/CalendarButton';
import DateFilter from '../dateFilter/DateFilter';
import { getEventFields } from '../utils';
import styles from './occurrences.module.scss';
import { useDateFiltering } from './useDateFiltering';

interface Props {
  event: EventFieldsFragment;
  eventLocationId: string;
  occurrences: OccurrenceFieldsFragment[];
  showMoreOccurrences: () => void;
  enrolOccurrence: ((id: string) => void) | null;
  showMoreButtonVisible: boolean;
  selectOccurrence: (id: string) => void;
  deselectOccurrence: (id: string) => void;
  neededOccurrences?: number;
  selectedOccurrences?: string[];
}

const enrolButtonColumnWidth = '250px';

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
  showMoreOccurrences,
  enrolOccurrence,
  showMoreButtonVisible,
  selectOccurrence,
  deselectOccurrence,
  neededOccurrences,
  selectedOccurrences,
}) => {
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
        filteredOccurrences={filteredOccurrences}
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
  const locale = useLocale();
  const columns = [
    {
      Header: t('enrolment:occurrenceTable.columnDate'),
      accessor: (row: OccurrenceFieldsFragment) =>
        formatDate(new Date(row.startTime), 'dd.MM.yyyy eeeeee', locale),
      id: 'date',
    },
    {
      Header: t('enrolment:occurrenceTable.columnTime'),
      accessor: (row: OccurrenceFieldsFragment) =>
        formatTimeRange(new Date(row.startTime), new Date(row.endTime), locale),

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
    {
      Header: t('enrolment:occurrenceTable.columnSeatsInfo'),
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
  ];

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

const EnrolmentButtonCell: React.FC<{
  event: EventFieldsFragment;
  value: OccurrenceFieldsFragment;
  selectedOccurrences: string[] | undefined;
  enrolOccurrence: ((id: string) => void) | null;
  selectOccurrence: (id: string) => void;
  deselectOccurrence: (id: string) => void;
  neededOccurrences?: number;
}> = ({
  value,
  event,
  selectedOccurrences,
  neededOccurrences,
  enrolOccurrence,
  deselectOccurrence,
  selectOccurrence,
}) => {
  const locale = useLocale();
  const { t } = useTranslation();
  const { autoAcceptance } = getEventFields(event, locale);
  const getEnrolmentError = (
    occurrence: OccurrenceFieldsFragment,
    event: EventFieldsFragment
  ) => {
    if (isEnrolmentClosed(occurrence, event))
      return ENROLMENT_ERRORS.ENROLMENT_CLOSED_ERROR;
    if (!hasOccurrenceSpace(occurrence))
      return ENROLMENT_ERRORS.NOT_ENOUGH_CAPACITY_ERROR;
    return null;
  };

  if (!isEnrolmentStarted(event)) {
    return t('enrolment:errors.label.enrolmentStartsAt', {
      date: formatDate(new Date(event.pEvent.enrolmentStart), 'dd.MM.yyyy'),
      time: formatDate(new Date(event.pEvent.enrolmentStart), 'HH:mm'),
    });
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
  // if required amount of occurrences already selected, show disabled button for others
  const selectionDisabled =
    selectedOccurrences?.length === neededOccurrences &&
    !selectedOccurrences?.includes(value.id);
  const isSelectedOccurrence = selectedOccurrences?.includes(value.id);
  if (neededOccurrences === 1) {
    const buttonText = t(
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
        {buttonText}
      </button>
    );
  }

  let buttonText: string;
  if (selectionDisabled || isSelectedOccurrence) {
    buttonText = t('occurrence:occurrenceSelection.buttonSelectedOccurrences', {
      selectedOccurrences: selectedOccurrences?.length,
      neededOccurrences,
    });
  } else {
    buttonText = t(
      `occurrence:occurrenceSelection.${
        autoAcceptance ? 'buttonEnrolOccurrence' : 'reservationEnquiryButton'
      }`
    );
  }

  return (
    <Button
      variant={
        selectionDisabled || isSelectedOccurrence ? 'primary' : 'secondary'
      }
      onClick={() =>
        (isSelectedOccurrence ? deselectOccurrence : selectOccurrence)(value.id)
      }
      style={{ width: enrolButtonColumnWidth }}
      className={styles[autoAcceptance ? 'enrolButton' : 'enquiryButton']}
      disabled={selectionDisabled}
    >
      {buttonText}
    </Button>
  );
};

const OccurrenceInfo: React.FC<{
  occurrence: OccurrenceFieldsFragment;
  event: EventFieldsFragment;
  eventLocationId: string;
}> = ({ occurrence, event, eventLocationId }) => {
  const { placeId, startTime, endTime, linkedEvent } = occurrence;
  const { t } = useTranslation();
  const locale = useLocale();
  const date = formatDate(new Date(startTime), 'EEEE dd.MM.yyyy', locale);
  const time =
    startTime &&
    formatTimeRange(new Date(startTime), new Date(endTime), locale);
  const offer = linkedEvent?.offers?.[0];
  const price = offer?.price?.[locale];
  const priceDescription = offer?.description?.[locale];
  const isFree = offer?.isFree ?? !price;
  const priceInfoUrl = offer?.infoUrl?.[locale];

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
        <div>
          {t('occurrence:textDateAndTime', { date: capitalize(date), time })}
        </div>
        <OccurrenceGroupInfo occurrence={occurrence} />
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
