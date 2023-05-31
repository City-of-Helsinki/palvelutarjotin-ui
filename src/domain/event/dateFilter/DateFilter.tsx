import classNames from 'classnames';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import { Button, DateInput, IconPen } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import styles from './dateFilter.module.scss';
import { DATE_FORMAT } from '../../../common/components/form/fields/DateInputField';
import useLocale from '../../../hooks/useLocale';

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
  const locale = useLocale();
  const startDateFilterId = 'date-start-filter';
  const endDateFilterId = 'date-end-filter';

  const getDateInputValue = (dateInputValue: Date) =>
    dateInputValue && isValid(dateInputValue)
      ? format(dateInputValue, DATE_FORMAT)
      : '';

  const getDateInputOnChangeHandler =
    (fieldValueSetter: (date?: Date | null) => void) =>
    (inputValue: string, valueAsDate: Date) => {
      if (valueAsDate > new Date()) fieldValueSetter(valueAsDate);
    };

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
        <DateInput
          id={startDateFilterId}
          value={getDateInputValue(startDate)}
          onChange={getDateInputOnChangeHandler(setStartFilterDate)}
          minDate={new Date()}
          language={locale}
          openButtonAriaLabel={t(
            'event:occurrenceList.labelStartDateFilterDatepicker'
          )}
          disableConfirmation
        />
      </div>
      <span className={styles.dateSeparator} aria-hidden>
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
        <DateInput
          id={endDateFilterId}
          value={getDateInputValue(endDate)}
          onChange={getDateInputOnChangeHandler(setEndFilterDate)}
          minDate={startDate ?? new Date()}
          language={locale}
          openButtonAriaLabel={t(
            'event:occurrenceList.labelEndDateFilterDatepicker'
          )}
          disableConfirmation
        />
      </div>
    </>
  );
};

export default DateFilter;
