import {
  Notification,
  IconAngleUp,
  Button,
  IconArrowDown,
  Checkbox,
} from 'hds-react';
import take from 'lodash/take';
import { useTranslation } from 'next-i18next';
import React from 'react';

import ErrorMessage from '../../../common/components/form/ErrorMessage';
import Table from '../../../common/components/table/Table';
import {
  EventFieldsFragment,
  OccurrenceFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import formatTimeRange from '../../../utils/formatTimeRange';
import { DATE_FORMAT, formatLocalizedDate } from '../../../utils/time/format';
import { translateValue } from '../../../utils/translateUtils';
import { skipFalsyType } from '../../../utils/typescript.utils';
import { ENROLMENT_ERRORS } from '../../enrolment/constants';
import {
  getAmountOfSeatsLeft,
  hasOccurrenceSpace,
  isEnrolmentClosed,
  isMultidayOccurrence,
  isOccurrenceCancelled,
  isUnenrollableOccurrence,
} from '../../occurrence/utils';
import PlaceText from '../../place/placeText/PlaceText';
import { EnrolmentType, OCCURRENCE_LIST_PAGE_SIZE } from '../constants';
import DateFilter from '../dateFilter/DateFilter';
import { getEnrolmentType } from '../utils';
import OccurrenceInfo from './OccurrenceInfo';
import styles from './occurrences.module.scss';
import { useDateFiltering } from './useDateFiltering';

interface Props {
  event: EventFieldsFragment;
  eventLocationId: string;
  occurrences: OccurrenceFieldsFragment[];
  selectOccurrence: (id: string) => void;
  deselectOccurrence: (id: string) => void;
  neededOccurrences?: number;
  selectedOccurrences?: string[];
  hideLoadMoreButton?: boolean;
}

export const enrolButtonColumnWidth = '250px';

const OccurrencesTable: React.FC<Props> = ({
  event,
  eventLocationId,
  occurrences,
  selectOccurrence,
  deselectOccurrence,
  neededOccurrences,
  selectedOccurrences,
  hideLoadMoreButton,
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
  const showMoreButtonVisible =
    filteredOccurrences.length > occurrencesVisible && !hideLoadMoreButton;

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
  selectOccurrence: (id: string) => void;
  deselectOccurrence: (id: string) => void;
  neededOccurrences?: number;
  selectedOccurrences?: string[];
  filteredOccurrences: OccurrenceFieldsFragment[];
}> = ({
  event,
  eventLocationId,
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
  const requiredOccurrencesSelected =
    selectedOccurrences?.length === neededOccurrences;

  const handleOccurrenceCheckboxClick = (
    occurrence: OccurrenceFieldsFragment
  ) => {
    if (selectedOccurrences?.includes(occurrence.id)) {
      deselectOccurrence(occurrence.id);
    } else {
      selectOccurrence(occurrence.id);
    }
  };

  const isSelectedOccurrence = (occurrence: OccurrenceFieldsFragment) =>
    !!selectedOccurrences?.includes(occurrence.id);

  const isDisabledOccurrenceCheckbox = (occurrence: OccurrenceFieldsFragment) =>
    isUnenrollableOccurrence(occurrence, event) ||
    (requiredOccurrencesSelected && !isSelectedOccurrence(occurrence));

  const columns = [
    {
      id: 'spacing-1',
      Header: '',
      'aria-hidden': true,
    },
    {
      Header: t('enrolment:occurrenceTable.columnDate'),
      accessor: (row: OccurrenceFieldsFragment) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {!!neededOccurrences && neededOccurrences > 1 && (
            <Checkbox
              id={row.id}
              disabled={isDisabledOccurrenceCheckbox(row)}
              onChange={() => handleOccurrenceCheckboxClick(row)}
              checked={isSelectedOccurrence(row)}
              aria-label={t(
                'occurrence:occurrenceSelection.checkboxSelectOccurrence'
              )}
            />
          )}
          {formatLocalizedDate(
            new Date(row.startTime),
            `${DATE_FORMAT} eeeeee`,
            locale
          )}
        </div>
      ),
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
      Header: t('enrolment:occurrenceTable.columnLanguage'),
      accessor: (row: OccurrenceFieldsFragment) =>
        row.languages.edges.map((lang) => lang?.node?.id).join(', ') ?? '-',
      id: 'languages',
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
      Cell: ({
        row,
        value,
      }: {
        value: OccurrenceFieldsFragment;
        row: {
          getToggleRowExpandedProps: () => React.ComponentProps<typeof Button>;
          isExpanded: boolean;
        };
      }) => {
        const { title, ...expandProps } = row.getToggleRowExpandedProps();
        return (
          <OccurrenceExpandButton
            {...expandProps}
            isExpanded={row.isExpanded}
            style={{ width: '100%' }}
            event={event}
            occurrence={value}
          />
        );
      },
      id: 'enrol',
      style: {
        width: enrolButtonColumnWidth,
      },
    },
    {
      id: 'spacing-2',
      Header: '',
      'aria-hidden': true,
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

const OccurrenceExpandButton: React.FC<
  React.ComponentProps<typeof Button> & {
    isExpanded: boolean;
    event: EventFieldsFragment;
    occurrence: OccurrenceFieldsFragment;
  }
> = ({ isExpanded, event, occurrence, ...props }) => {
  const { t } = useTranslation();

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

  // Show error message if enrolment is not available
  const error = getEnrolmentError(occurrence, event);
  if (error) {
    return (
      <ErrorMessage>
        {translateValue('enrolment:errors.label.', error, t)}
      </ErrorMessage>
    );
  }

  return (
    <Button
      {...props}
      style={{ width: '100%' }}
      size="small"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      variant={isExpanded ? 'supplementary' : ('primary' as any)}
      iconRight={isExpanded ? <IconAngleUp /> : null}
      aria-expanded={isExpanded ? true : false}
      className={styles.enrolmentExpandButton}
    >
      {isExpanded
        ? t('occurrence:buttonHideDetails')
        : t('occurrence:buttonShowDetails')}
    </Button>
  );
};

const OccurrencesTableContainer: React.FC<Props> = (props) => {
  const { t } = useTranslation();

  if (!props.occurrences.length) {
    return (
      <Notification
        label={t('enrolment:occurrenceTable.noOccurrences')}
        type="error"
      />
    );
  }

  return <OccurrencesTable {...props} />;
};

export default OccurrencesTableContainer;
