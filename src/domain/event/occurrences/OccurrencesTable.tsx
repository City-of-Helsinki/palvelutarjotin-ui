import { ColumnDef } from '@tanstack/react-table';
import {
  Notification,
  IconAngleUp,
  Button,
  ButtonSize,
  ButtonVariant,
  IconArrowDown,
} from 'hds-react';
import take from 'lodash/take';
import { TFunction, useTranslation } from 'next-i18next';
import React from 'react';

import DateCell from './DateCell';
import EnrolmentError from './EnrolmentError';
import LanguageCell from './LanguageCell';
import OccurrenceInfo from './OccurrenceInfo';
import styles from './occurrences.module.scss';
import { useDateFiltering } from './useDateFiltering';
import { getEnrolmentError } from './utils';
import Table from '../../../common/components/table/Table';
import {
  EventFieldsFragment,
  OccurrenceFieldsFragment,
} from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import type { I18nNamespace, Language } from '../../../types';
import formatTimeRange from '../../../utils/formatTimeRange';
import { formatIntoDate, formatIntoTime } from '../../../utils/time/format';
import {
  getAmountOfSeatsLeft,
  isEnrolmentStarted,
  isMultidayOccurrence,
  isUnenrollableOccurrence,
} from '../../occurrence/utils';
import PlaceText from '../../place/placeText/PlaceText';
import { EnrolmentType, OCCURRENCE_LIST_PAGE_SIZE } from '../constants';
import DateFilter from '../dateFilter/DateFilter';
import { getEnrolmentType } from '../utils';

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

export const enrolButtonColumnWidth = '265px';

type OccurrenceColumnsDeps = {
  t: TFunction;
  locale: Language;
  event: EventFieldsFragment;
  eventLocationId: string;
  neededOccurrences?: number;
  hasInternalEnrolment: boolean;
  isDisabledOccurrenceCheckbox: (
    occurrence: OccurrenceFieldsFragment
  ) => boolean;
  handleOccurrenceCheckboxClick: (occurrence: OccurrenceFieldsFragment) => void;
  isSelectedOccurrence: (occurrence: OccurrenceFieldsFragment) => boolean;
};

function createOccurrenceColumns({
  t,
  locale,
  event,
  eventLocationId,
  neededOccurrences,
  hasInternalEnrolment,
  isDisabledOccurrenceCheckbox,
  handleOccurrenceCheckboxClick,
  isSelectedOccurrence,
}: OccurrenceColumnsDeps): ColumnDef<OccurrenceFieldsFragment>[] {
  return [
    {
      id: 'spacing-1',
      header: '',
      meta: { 'aria-hidden': true },
    },
    {
      header: t('enrolment:occurrenceTable.columnDate'),
      cell: (ctx) => (
        <DateCell
          {...ctx}
          neededOccurrences={neededOccurrences}
          isDisabledOccurrenceCheckbox={isDisabledOccurrenceCheckbox}
          handleOccurrenceCheckboxClick={handleOccurrenceCheckboxClick}
          isSelectedOccurrence={isSelectedOccurrence}
          locale={locale}
        />
      ),
      id: 'date',
    },
    {
      accessorFn: (row: OccurrenceFieldsFragment) => {
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
      header: t('enrolment:occurrenceTable.columnLanguage'),
      cell: (ctx) => <LanguageCell {...ctx} />,
      id: 'languages',
    },
    {
      header: t('enrolment:occurrenceTable.columnPlace'),
      cell: ({ row }) => {
        const placeId = row.original.placeId || eventLocationId;
        return placeId ? <PlaceText placeId={placeId} /> : '-';
      },
      id: 'place',
    },
    ...(hasInternalEnrolment
      ? ([
          {
            // Keep this column empty if enrolment is done outside of kultus
            header: hasInternalEnrolment
              ? t('enrolment:occurrenceTable.columnSeatsInfo')
              : '',
            accessorFn: (row) =>
              `${getAmountOfSeatsLeft(row)} / ${row.amountOfSeats}`,
            id: 'seatsInfo',
          },
        ] as ColumnDef<OccurrenceFieldsFragment>[])
      : []),
    {
      cell: ({ row }) => {
        return (
          <OccurrenceExpandButton
            onClick={() => row.toggleExpanded()}
            isExpanded={row.getIsExpanded()}
            style={{ width: '100%' }}
            event={event}
            occurrence={row.original}
          />
        );
      },
      id: 'enrol',
      meta: {
        style: {
          width: enrolButtonColumnWidth,
        },
      },
    },
    {
      id: 'spacing-2',
      header: '',
      meta: { 'aria-hidden': true },
    },
  ];
}

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
  const { t } = useTranslation<I18nNamespace>();

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

  const showMoreOccurrences = () => {
    setOccurrencesVisible(occurrencesVisible + OCCURRENCE_LIST_PAGE_SIZE);
  };
  const visibleOccurrences = take(filteredOccurrences, occurrencesVisible);
  const showMoreButtonVisible =
    filteredOccurrences.length > occurrencesVisible && !hideLoadMoreButton;
  const enrolmentStart = event.pEvent.enrolmentStart;

  return (
    <section className={styles.occurrenceTable}>
      {!isEnrolmentStarted(event) && (
        <Notification
          className={styles.enrolmentNotification}
          label={t('event:occurrenceList.enrolmentStartsLabel')}
        >
          {t('event:occurrenceList.enrolmentStartsAt', {
            date: formatIntoDate(new Date(enrolmentStart)),
            time: formatIntoTime(new Date(enrolmentStart)),
          })}
        </Notification>
      )}
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
            variant={ButtonVariant.Supplementary}
            iconStart={<IconArrowDown />}
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
  const { t } = useTranslation<I18nNamespace>();
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
    !isEnrolmentStarted(event) ||
    (requiredOccurrencesSelected && !isSelectedOccurrence(occurrence));

  const columns = createOccurrenceColumns({
    t,
    locale,
    event,
    eventLocationId,
    neededOccurrences,
    hasInternalEnrolment,
    isDisabledOccurrenceCheckbox,
    handleOccurrenceCheckboxClick,
    isSelectedOccurrence,
  });

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
  Omit<React.ComponentProps<typeof Button>, 'children'> & {
    isExpanded: boolean;
    event: EventFieldsFragment;
    occurrence: OccurrenceFieldsFragment;
  }
> = ({ isExpanded, event, occurrence, ...props }) => {
  const { t } = useTranslation<I18nNamespace>();

  // Show error message if enrolment is not available
  const error = getEnrolmentError(occurrence, event);
  if (error) {
    return <EnrolmentError error={error} />;
  }

  return (
    <Button
      {...props}
      style={{ width: '100%' }}
      size={ButtonSize.Small}
      variant={isExpanded ? ButtonVariant.Supplementary : ButtonVariant.Primary}
      iconEnd={isExpanded ? <IconAngleUp /> : null}
      aria-expanded={isExpanded ? true : false}
      className={styles.enrolmentExpandButton}
      aria-label={t('occurrence:ariaLabelShowDetails')}
    >
      {isExpanded
        ? t('occurrence:buttonHideDetails')
        : t('occurrence:buttonShowDetails')}
    </Button>
  );
};

const OccurrencesTableContainer: React.FC<Props> = (props) => {
  const { t } = useTranslation<I18nNamespace>();

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
