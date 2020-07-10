import classNames from 'classnames';
import {
  Notification,
  IconAngleDown,
  Button,
  IconCalendar,
  IconLocation,
  IconClock,
} from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Table from '../../../common/components/table/Table';
import { OccurrenceFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import formatDate from '../../../utils/formatDate';
import formatTimeRange from '../../../utils/formatTimeRange';
import OccurrenceGroupInfo from '../../occurrence/occurrenceGroupInfo/OccurrenceGroupInfo';
import PlaceInfo from '../../place/placeInfo/PlaceInfo';
import PlaceText from '../../place/placeText/PlaceText';
import styles from './occurrences.module.scss';

interface Props {
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

const OccurrenceTable: React.FC<Props> = ({
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

  const renderEnrolmentButton = ({
    value,
  }: {
    value: OccurrenceFieldsFragment;
  }) => {
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
        `${row.amountOfSeats} (${row.minGroupSize}-${row.maxGroupSize})`,
      id: 'seatsInfo',
    },
    {
      accessor: (row: OccurrenceFieldsFragment) => row,
      Cell: renderEnrolmentButton,
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
          getToggleRowExpandedProps: any;
          isExpanded: boolean;
        };
      }) => {
        return (
          <button
            aria-label={t('occurrence:showOccurrenceDetails')}
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
          <Button iconLeft={<IconCalendar />} variant="supplementary">
            {t('event:occurrenceList.downloadToCalendar')}
          </Button>
          <Button iconLeft={<IconLocation />} variant="supplementary">
            {t('event:occurrenceList.showAllLocationEvents')}
          </Button>
        </div>
      </div>
    );
  };

  return occurrences.length ? (
    <section className={styles.occurrenceTable}>
      <p className={styles.occurrencesTitle}>
        {t('event:occurrencesTitle', { count: occurrences.length })}{' '}
      </p>
      <Table
        columns={columns}
        data={occurrences}
        renderExpandedArea={renderOccurrenceInfo}
      />
      {showMoreButtonVisible && (
        <div className={styles.loadMoreButtonWrapper}>
          <Button onClick={showMoreOccurrences} variant="supplementary">
            {t('event:occurrenceList.loadMoreOccurrences')}
          </Button>
        </div>
      )}
    </section>
  ) : (
    <Notification
      labelText={t('enrolment:occurrenceTable.noOccurrences')}
      type="error"
    />
  );
};

export default OccurrenceTable;
