import React from 'react';
import { useTranslation } from 'react-i18next';

import { OccurrenceFieldsFragment } from '../../../generated/graphql';

interface Props {
  occurrence: OccurrenceFieldsFragment;
}

const OccurrenceGroupInfo: React.FC<Props> = ({ occurrence }) => {
  const { t } = useTranslation();

  const languages = occurrence.languages.map((language) => language.id);
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
    languages
      ?.map((language) => t(`occurrence:languages.${language}`))
      .join(', '),
  ]
    .filter((e) => e)
    .join(', ');

  return <p>{groupInfo}</p>;
};

export default OccurrenceGroupInfo;
