import { CellContext } from '@tanstack/react-table';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { getOrderedLanguages } from './utils';
import SrOnly from '../../../common/components/SrOnly/SrOnly';
import { OccurrenceFieldsFragment } from '../../../generated/graphql';
import type { I18nNamespace } from '../../../types';
import { skipFalsyType } from '../../../utils/typescript.utils';

export type LanguageCellProps = CellContext<OccurrenceFieldsFragment, unknown>;

const LanguageCell: React.FC<LanguageCellProps> = ({ row }) => {
  const { t } = useTranslation<I18nNamespace>();
  const languages = row.original.languages.edges
    .map((lang) => lang?.node)
    .filter(skipFalsyType);

  if (!languages.length) {
    return '–';
  }

  const orderedLanguages = getOrderedLanguages(languages);
  return (
    <div>
      <SrOnly>
        {orderedLanguages
          .map((lang) => t(`common:languages.${lang}`))
          .join(', ') ?? '-'}
      </SrOnly>
      <span aria-hidden="true">
        {orderedLanguages.map((lang) => lang).join(', ') ?? '-'}
      </span>
    </div>
  );
};

export default LanguageCell;
