import { Notification } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import Table from '../../../common/components/table/Table';
import { OccurrenceFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import formatDate from '../../../utils/formatDate';
import formatTimeRange from '../../../utils/formatTimeRange';
import { getAmountOfSeatsLeft } from '../../occurrence/utils';
import PlaceText from '../../place/placeText/PlaceText';

interface Props {
  eventLocationId: string;
  occurrences: OccurrenceFieldsFragment[];
}

const OccurrenceTable: React.FC<Props> = ({ eventLocationId, occurrences }) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const columns = [
    {
      Header: t('enrolment:occurrenceTable.columnDate'),
      accessor: (row: OccurrenceFieldsFragment) =>
        formatDate(new Date(row.startTime), 'd.M.yyyy eeeeee', locale),
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
  ];
  return occurrences.length ? (
    <>
      <h2>{t('enrolment:occurrenceTable.title')}</h2>
      <Table columns={columns} data={occurrences} />
    </>
  ) : (
    <Notification
      label={t('enrolment:occurrenceTable.noSelectedOccurrences')}
      type="error"
    />
  );
};

export default OccurrenceTable;
