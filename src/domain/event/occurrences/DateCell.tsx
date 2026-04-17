import { CellContext } from '@tanstack/react-table';
import { Checkbox } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { DATE_FORMAT } from '../../../constants';
import { OccurrenceFieldsFragment } from '../../../generated/graphql';
import type { I18nNamespace, Language } from '../../../types';
import {
  formatDateRange,
  formatLocalizedDate,
} from '../../../utils/time/format';
import { isMultidayOccurrence } from '../../occurrence/utils';

export type DateCellProps = CellContext<OccurrenceFieldsFragment, unknown> & {
  neededOccurrences: number | undefined;
  isDisabledOccurrenceCheckbox: (
    occurrence: OccurrenceFieldsFragment
  ) => boolean;
  handleOccurrenceCheckboxClick: (occurrence: OccurrenceFieldsFragment) => void;
  isSelectedOccurrence: (occurrence: OccurrenceFieldsFragment) => boolean;
  locale: Language;
};

const DateCell: React.FC<DateCellProps> = ({
  row,
  neededOccurrences,
  isDisabledOccurrenceCheckbox,
  handleOccurrenceCheckboxClick,
  isSelectedOccurrence,
  locale,
}) => {
  const { t } = useTranslation<I18nNamespace>();
  const occurrence = row.original;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {!!neededOccurrences && neededOccurrences > 1 && (
        <Checkbox
          id={row.original.id}
          disabled={isDisabledOccurrenceCheckbox(occurrence)}
          onChange={() => handleOccurrenceCheckboxClick(occurrence)}
          checked={isSelectedOccurrence(occurrence)}
          aria-label={t(
            'occurrence:occurrenceSelection.checkboxSelectOccurrence'
          )}
        />
      )}
      {isMultidayOccurrence(occurrence)
        ? formatDateRange(
            new Date(occurrence.startTime),
            new Date(occurrence.endTime)
          )
        : formatLocalizedDate(
            new Date(occurrence.startTime),
            `${DATE_FORMAT} eeeeee`,
            locale
          )}
    </div>
  );
};

export default DateCell;
