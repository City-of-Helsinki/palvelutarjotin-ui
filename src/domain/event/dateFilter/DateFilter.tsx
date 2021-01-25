import classNames from 'classnames';
import { Button, IconPen } from 'hds-react';
import React from 'react';

import Datepicker from '../../../common/components/datepicker/Datepicker';
import { useTranslation } from '../../../i18n';
import styles from './dateFilter.module.scss';

export interface DateFilterProps {
  dateFiltersChanged: boolean;
  setInitialDateFilters: () => void;
  setStartFilterDate: (date?: Date | null) => void;
  setEndFilterDate: (date?: Date | null) => void;
  isInitialStartDate: boolean;
  startDate: Date;
  isInitialEndDate: boolean;
  endDate: Date;
}

const DateFilter: React.FC<DateFilterProps> = ({
  dateFiltersChanged,
  setInitialDateFilters,
  setStartFilterDate,
  setEndFilterDate,
  isInitialStartDate,
  isInitialEndDate,
  startDate,
  endDate,
}) => {
  const { t } = useTranslation();

  const startDateFilterId = 'date-start-filter';
  const endDateFilterId = 'date-end-filter';

  return (
    <>
      {dateFiltersChanged && (
        <Button
          className={styles.resetDateFiltersButton}
          variant="supplementary"
          onClick={setInitialDateFilters}
          iconLeft={<IconPen />}
        >
          {t('event:filters.deleteDateFilter')}
        </Button>
      )}

      <div
        className={classNames(styles.dateFilter, {
          [styles.inactiveDateFilter]: isInitialStartDate,
        })}
      >
        <label className={styles.srOnly} htmlFor={startDateFilterId}>
          {t('event:occurrenceList.labelStartDateFilter')}
        </label>
        <Datepicker
          id={startDateFilterId}
          value={startDate}
          onChange={setStartFilterDate}
        />
      </div>
      <span className={styles.dateSeparator} area-hidden="true">
        -
      </span>
      <div
        className={classNames(styles.dateFilter, {
          [styles.inactiveDateFilter]: isInitialEndDate,
        })}
      >
        <label className={styles.srOnly} htmlFor={endDateFilterId}>
          {t('event:occurrenceList.labelEndDateFilter')}
        </label>
        <Datepicker
          id={endDateFilterId}
          value={endDate}
          onChange={setEndFilterDate}
        />
      </div>
    </>
  );
};

export default DateFilter;
