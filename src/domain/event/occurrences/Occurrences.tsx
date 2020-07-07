import classNames from 'classnames';
import { Notification, IconAngleDown, Button } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Table from '../../../common/components/table/Table';
import { OccurrenceFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import formatDate from '../../../utils/formatDate';
import formatTimeRange from '../../../utils/formatTimeRange';
import PlaceText from '../../place/placeText/PlaceText';
import styles from './occurrences.module.scss';

interface Props {
  eventLocationId: string;
  occurrences: OccurrenceFieldsFragment[];
  showMoreOccurrences: () => void;
  enrolOccurrence: ((id: string) => void) | null;
  showMoreButtonVisible: boolean;
}

const OccurrenceTable: React.FC<Props> = ({
  eventLocationId,
  occurrences,
  showMoreOccurrences,
  enrolOccurrence,
  showMoreButtonVisible,
}) => {
  const { t } = useTranslation();
  const locale = useLocale();
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
      Cell: ({ value }: { value: OccurrenceFieldsFragment }) => {
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
      },
      id: 'enrol',
      style: {
        width: '250px',
      },
    },
    {
      Header: t('enrolment:occurrenceTable.columnAdditionalInfo'),
      accessor: (row: OccurrenceFieldsFragment) => {
        return row;
      },
      Cell: ({ value }: { value: OccurrenceFieldsFragment }) => {
        return (
          <button aria-label="Expand">
            <IconAngleDown
              className={classNames(styles.iconAngle, {
                // [styles.iconAngleUp]: isMenuOpen,
              })}
            />
          </button>
        );
      },
      style: {
        textAlign: 'right',
        width: '1%',
      },
      id: 'additionalInfo',
    },
  ];

  return occurrences.length ? (
    <section className={styles.occurrenceTable}>
      <p className={styles.occurrencesTitle}>
        {t('event:occurrencesTitle', { count: occurrences.length })}{' '}
      </p>
      <Table columns={columns} data={occurrences} />
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
