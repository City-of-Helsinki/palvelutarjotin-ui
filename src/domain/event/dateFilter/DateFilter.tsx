import classNames from 'classnames';
import { Button } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Datepicker from '../../../common/components/datepicker/Datepicker';
import styles from './dateFilter.module.scss';

interface DateFilterProps {
  dateFiltersChanged: boolean;
  setInitialDateFilters: () => void;
  setStartFilterDate: () => void;
  setEndFilterDate: () => void;
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
      <span className={styles.dateSeparator}>-</span>
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
