import { useTranslation } from 'next-i18next';
import React from 'react';

import { OccurrenceFieldsFragment } from '../../../generated/graphql';

interface Props {
  occurrence: OccurrenceFieldsFragment;
}

const OccurrenceGroupLanguageInfo: React.FC<Props> = ({ occurrence }) => {
  const { t } = useTranslation();

  const languages =
    occurrence.languages.edges.map((edge) => edge?.node?.id ?? '') ?? [];

  return (
    <p>
      {t('occurrence:labelLanguages')}:{' '}
      {languages
        ?.map((language) => t(`common:languages.${language}`))
        .join(', ')}
    </p>
  );
};

export default OccurrenceGroupLanguageInfo;
