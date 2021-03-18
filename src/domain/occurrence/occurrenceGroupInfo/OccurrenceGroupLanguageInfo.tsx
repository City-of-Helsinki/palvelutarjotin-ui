import React from 'react';

import { OccurrenceFieldsFragment } from '../../../generated/graphql';
import { useTranslation } from '../../../i18n';

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
        ?.map((language) => t(`occurrence:languages.${language}`))
        .join(', ')}
    </p>
  );
};

export default OccurrenceGroupLanguageInfo;
