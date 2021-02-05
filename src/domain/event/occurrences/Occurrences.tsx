import classNames from 'classnames';
import {
  Notification,
  IconAngleDown,
  Button,
  IconLocation,
  IconClock,
  IconArrowDown,
} from 'hds-react';
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
import {
  hasOccurrenceSpace,
  isEnrolmentClosed,
  isEnrolmentStarted,
} from '../../occurrence/utils';
import PlaceInfo from '../../place/placeInfo/PlaceInfo';
import PlaceText from '../../place/placeText/PlaceText';
import CalendarButton from '../calendarButton/CalendarButton';
import DateFilter from '../dateFilter/DateFilter';
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

const Occurrences: React.FC<Props> = ({
  event,
  eventLocationId,
  occurrences,
  showMoreOccurrences,
  enrolOccurrence,
  showMoreButtonVisible,
  deselectOccurrence,
  selectOccurrence,
  neededOccurrences = 0,
  selectedOccurrences,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();

  // This hook filters occurrences only by date, rest of the filtering (if added more)
  // could be in this hook but hook name should be changed
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

  const renderEnrolmentButtonCell = ({
    value,
  }: {
    value: OccurrenceFieldsFragment;
  }) => {
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
      !selectedOccurrences.includes(value.id);
    const isSelectedOccurrence = selectedOccurrences?.includes(value.id);

    if (neededOccurrences === 1) {
      return (
        <button
          className={styles.enrolButton}
          onClick={() => {
            if (enrolOccurrence) {
              enrolOccurrence(value.id);
            }
          }}
        >
          {t('event:occurrenceList.enrolOccurrenceButton')}
        </button>
      );
    }

    let buttonText: string;
    if (selectionDisabled || isSelectedOccurrence) {
      buttonText = t(
        'occurrence:occurrenceSelection.buttonSelectedOccurrences',
        { selectedOccurrences: selectedOccurrences?.length, neededOccurrences }
      );
    } else {
      buttonText = t('occurrence:occurrenceSelection.buttonEnrolOccurrence');
    }

    return (
      <Button
        variant={
          selectionDisabled || isSelectedOccurrence ? 'primary' : 'secondary'
        }
        onClick={
          isSelectedOccurrence
            ? () => deselectOccurrence(value.id)
            : () => selectOccurrence(value.id)
        }
        style={{ width: enrolButtonColumnWidth }}
        disabled={selectionDisabled}
      >
        {buttonText}
      </Button>
    );
  };

  const columns = [
    {
      Header: t('enrolment:occurrenceTable.columnDate'),
      accessor: (row: OccurrenceFieldsFragment) =>
        formatDate(new Date(row.startTime)),
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
        `${row.amountOfSeats - row.seatsTaken} / ${row.amountOfSeats}`,
      id: 'seatsInfo',
    },
    {
      accessor: (row: OccurrenceFieldsFragment) => row,
      Cell: renderEnrolmentButtonCell,
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

  const renderOccurrenceInfo = (occurrence: OccurrenceFieldsFragment) => {
    const { placeId, startTime, endTime } = occurrence;
    const date = formatDate(new Date(startTime));
    const time =
      startTime &&
      formatTimeRange(new Date(startTime), new Date(endTime), locale);
    return (
      <div className={styles.occurrenceDetails}>
        <div>
          <div className={styles.infoSection}>
            <div>
              <IconClock />
            </div>
            <div>
              <div className={styles.infoTitle}>
                {t('occurrence:dateAndTimeTitle')}
              </div>
              <div>{t('occurrence:textDateAndTime', { date, time })}</div>
              <OccurrenceGroupInfo occurrence={occurrence} />
            </div>
          </div>
          <div className={styles.infoSection}>
            <div>
              <IconLocation />
            </div>
            <div>
              <div className={styles.infoTitle}>
                {t('event:location.title')}
              </div>
              <PlaceInfo
                id={placeId || eventLocationId}
                language={locale}
                showVenueInfo
              />
            </div>
          </div>
        </div>
        <div className={styles.occurrenceActions}>
          {/* TODO: functionality for these buttons */}
          <CalendarButton event={event} occurrence={occurrence} />
          <Button iconLeft={<IconLocation />} variant="supplementary">
            {t('event:occurrenceList.showAllLocationEvents')}
          </Button>
        </div>
      </div>
    );
  };

  return occurrences.length ? (
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
      <Table
        columns={columns}
        data={filteredOccurrences}
        renderExpandedArea={renderOccurrenceInfo}
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
  ) : (
    <Notification
      label={t('enrolment:occurrenceTable.noOccurrences')}
      type="error"
    />
  );
};

export default Occurrences;
