import React from 'react';

import { OccurrenceFieldsFragment } from '../../../generated/graphql';
import { useTranslation } from '../../../i18n';

interface Props {
  occurrence: OccurrenceFieldsFragment;
}

const OccurrenceGroupInfo: React.FC<Props> = ({ occurrence }) => {
  const { t } = useTranslation();

  const amountOfSeats = occurrence?.amountOfSeats;
  const maxGroupSize = occurrence?.maxGroupSize;
  const minGroupSize = occurrence?.minGroupSize;
  const groupInfo = [
    t('occurrence:textAmountOfSeats', {
      count: amountOfSeats,
    }),
    t('occurrence:textGroupInfo', {
      maxGroupSize,
      minGroupSize,
    }),
  ]
    .filter((e) => e)
    .join(', ');

  return (
    <p>
      {t('occurrence:labelGroupInfo')}: {groupInfo}
    </p>
  );
};

export default OccurrenceGroupInfo;
