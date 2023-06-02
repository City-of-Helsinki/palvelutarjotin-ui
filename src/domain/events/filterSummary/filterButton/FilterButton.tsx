import classNames from 'classnames';
import { IconCross } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import styles from './filterButton.module.scss';

export type FilterType = 'organisation' | 'categories';

export interface FilterButtonProps {
  onRemove: (value: string, type: FilterType) => void;
  text: string;
  type: FilterType;
  value: string;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  onRemove,
  text,
  type,
  value,
}) => {
  const { t } = useTranslation();
  return (
    <div className={classNames(styles.filter, styles[type])}>
      <button
        type="button"
        className={styles.closeButton}
        onClick={() => onRemove(value, type)}
        aria-label={t('events:search.labelRemoveFilter', { filter: text })}
      >
        <IconCross size="s" aria-hidden />
      </button>
      {text}
    </div>
  );
};

export default FilterButton;
