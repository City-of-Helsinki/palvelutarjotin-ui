import { Notification } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import Table from '../../../common/components/table/Table';
import { OccurrenceFieldsFragment } from '../../../generated/graphql';
import useLocale from '../../../hooks/useLocale';
import type { I18nNamespace } from '../../../types';
import formatTimeRange from '../../../utils/formatTimeRange';
import { DATE_FORMAT, formatLocalizedDate } from '../../../utils/time/format';
import { getAmountOfSeatsLeft } from '../../occurrence/utils';
import PlaceText from '../../place/placeText/PlaceText';

interface Props {
  eventLocationId: string;
  occurrences: OccurrenceFieldsFragment[];
}

const OccurrenceTable: React.FC<Props> = ({ eventLocationId, occurrences }) => {
  const { t } = useTranslation<I18nNamespace>();
  const locale = useLocale();
  const columns = [
    {
      Header: t('enrolment:occurrenceTable.columnDate'),
      accessor: (row: OccurrenceFieldsFragment) =>
        formatLocalizedDate(
          new Date(row.startTime),
          `${DATE_FORMAT} eeeeee`,
          locale
        ),
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
