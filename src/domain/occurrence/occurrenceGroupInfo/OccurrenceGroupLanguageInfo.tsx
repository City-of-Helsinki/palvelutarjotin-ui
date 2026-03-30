import React from 'react';
import { useTranslation } from 'react-i18next';

import { OccurrenceFieldsFragment } from '../../../generated/graphql';
import type { I18nNamespace } from '../../../types';

interface Props {
  occurrence: OccurrenceFieldsFragment;
}

const OccurrenceGroupLanguageInfo: React.FC<Props> = ({ occurrence }) => {
  const { t } = useTranslation<I18nNamespace>();

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
