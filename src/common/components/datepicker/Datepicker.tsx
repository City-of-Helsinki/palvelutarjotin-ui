import {
  OnDatesChangeProps,
  START_DATE,
  useDatepicker,
} from '@datepicker-react/hooks';
import classNames from 'classnames';
import formatDate from 'date-fns/format';
import isValidDate from 'date-fns/isValid';
import parseDate from 'date-fns/parse';
import { IconAngleLeft, IconAngleRight, IconCalendar } from 'hds-react';
import uniqueId from 'lodash/uniqueId';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';

import { dateLocales } from './constants';
import styles from './datepicker.module.scss';
import DatepickerContext from './datepickerContext';
import Month from './Month';
import MonthNavButton from './MonthNavButton';
import TimesList from './TimesList';
import useLocale from '../../../hooks/useLocale';
import { DATETIME_FORMAT, DATE_FORMAT } from '../../../utils/time/format';
import SrOnly from '../SrOnly/SrOnly';
import InputWrapper from '../textInput/InputWrapper';
import inputStyles from '../textInput/inputWrapper.module.scss';
import { getTimeObjects, TimeObject } from '../timepicker/utils';

function generateUniqueId(prefix = 'datepicker-id') {
  return `${prefix}-${uniqueId()}`;
}

const dateRegex = /^\d{2}\.\d{2}\.\d{4}$/;
const datetimeRegex = /^\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/;
const MINUTE_INTERVAL = 15;

export type DatepickerProps = {
  className?: string;
  helperText?: string;
  id: string;
  invalidText?: string;
  labelText?: string;
  onBlur?: () => void;
  onChange: (value?: Date | null) => void;
  value: Date | null;
  timeSelector?: boolean;
  minuteInterval?: number;
  placeholder?: string;
  hideLabel?: boolean;
  minDate?: Date;
  maxDate?: Date;
};

const Datepicker: React.FC<DatepickerProps> = ({
  className,
  value,
  id,
  helperText,
  invalidText,
  labelText,
  onChange,
  onBlur,
  timeSelector,
  minuteInterval,
  placeholder,
  hideLabel,
  minDate,
  maxDate,
}) => {
  const [times] = useState(() =>
    getTimeObjects(minuteInterval || MINUTE_INTERVAL)
  );
  const [dateValue, setDateValue] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const datepickerClicked = React.useRef<boolean>(false);
  const container = React.useRef<HTMLDivElement>(null);
  const closeButton = React.useRef<HTMLButtonElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const datepickerContainer = React.useRef<HTMLDivElement>(null);
  const dialogLabelId = React.useMemo(
    () => generateUniqueId('dialog-label'),
    []
  );
  const locale = useLocale();
  const { t } = useTranslation();

  // Update formatted input string when date value changes
  React.useEffect(() => {
    if (!value) {
      setDateValue('');
    } else if (value && isValidDate(value)) {
      if (timeSelector) {
        const formattedDate = formatDate(value, DATETIME_FORMAT);
        setDateValue(formattedDate);
      } else {
        const formattedDate = formatDate(value, DATE_FORMAT);
        setDateValue(formattedDate);
      }
    }
  }, [timeSelector, value]);

  const handleDocumentKeyDown = (event: KeyboardEvent) => {
    if (!isComponentFocused()) return;

    switch (event.key) {
      case 'Escape':
        ensureCalendarIsClosed();
        break;
      case 'ArrowDown':
        ensureCalendarIsOpen();
        break;
    }
  };

  const onDocumentClick = () => {
    if (!isComponentFocused() && !datepickerClicked.current) {
      ensureCalendarIsClosed();
    }
    datepickerClicked.current = false;
  };

  const onDocumentFocusin = () => {
    if (!isComponentFocused()) {
      ensureCalendarIsClosed();
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', handleDocumentKeyDown);
    document.addEventListener('focusin', onDocumentFocusin);

    return () => {
      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('keydown', handleDocumentKeyDown);
      document.removeEventListener('focusin', onDocumentFocusin);
    };
  });

  const isComponentFocused = () => {
    const activeElement = document.activeElement;

    if (container.current?.contains(activeElement)) {
      return true;
    }
    return false;
  };

  const setNewDateWithTime = (previousDate: Date, newDate: Date) => {
    const hours = previousDate.getHours();
    const minutes = previousDate.getMinutes();
    const date = new Date(newDate);
    date.setMinutes(minutes);
    date.setHours(hours);
    onChange(date);
  };

  const handleDateChange = (data: OnDatesChangeProps) => {
    if (!timeSelector) {
      setIsCalendarOpen(false);
      inputRef.current?.focus();
    }

    if (value && data.startDate) {
      setNewDateWithTime(value, data.startDate);
    } else if (data.startDate) {
      onChange(data.startDate);
    } else {
      onChange(null);
    }
  };

  const preventArrowKeyScroll = (
    event: React.KeyboardEvent<HTMLDivElement>
  ) => {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        break;
    }
  };

  const ensureCalendarIsClosed = React.useCallback(() => {
    if (isCalendarOpen) {
      setIsCalendarOpen(false);
      onBlur && onBlur();
    }
  }, [isCalendarOpen, onBlur]);

  const ensureCalendarIsOpen = React.useCallback(() => {
    if (!isCalendarOpen) {
      setIsCalendarOpen(true);
    }
  }, [isCalendarOpen]);

  const toggleCalendar = () => {
    if (isCalendarOpen) {
      ensureCalendarIsClosed();
    } else {
      ensureCalendarIsOpen();
    }
  };

  const handleInputFocus = () => {
    if (!isCalendarOpen) {
      setIsCalendarOpen(true);
    } else {
      setIsCalendarOpen(false);
    }
  };

  const handleChange = (value: string) => {
    const parsedDate = parseDate(value, DATE_FORMAT, new Date());
    if (isValidDate(parsedDate)) {
      onChange(parsedDate);
    }
  };

  const dateIsInValidFormat = (parsedDate: Date, inputValue: string) => {
    const isParsedDateValid =
      isValidDate(parsedDate) && parsedDate.getFullYear() > 1970;
    if (timeSelector) {
      return isParsedDateValid && datetimeRegex.test(inputValue);
    }
    return isParsedDateValid && dateRegex.test(inputValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const eventValue = event.target.value;
    const dateFormat = timeSelector ? DATETIME_FORMAT : DATE_FORMAT;
    const parsedDate = parseDate(event.target.value, dateFormat, new Date());
    setDateValue(eventValue);

    if (dateIsInValidFormat(parsedDate, eventValue)) {
      onChange(parsedDate);
    } else {
      onChange(null);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    handleChange(dateValue);

    if (!isCalendarOpen) {
      setTimeout(() => onBlur && onBlur());
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleChange(dateValue);
    }
  };

  const handleTimeClick = React.useCallback(
    (time: TimeObject): void => {
      let newDate: Date;
      if (value) {
        newDate = new Date(value);
      } else {
        newDate = new Date();
      }
      newDate.setHours(time.hours);
      newDate.setMinutes(time.minutes);
      onChange(newDate);
      ensureCalendarIsClosed();
      // focus input for screen readers
      inputRef.current?.focus();
    },
    [ensureCalendarIsClosed, onChange, value]
  );

  const {
    firstDayOfWeek,
    activeMonths: [activeMonth],
    isDateSelected,
    isDateHovered,
    isFirstOrLastSelectedDate,
    isDateBlocked,
    isDateFocused,
    focusedDate,
    onDateHover,
    onDateSelect,
    onDateFocus,
    goToPreviousMonths,
    goToNextMonths,
  } = useDatepicker({
    startDate: isValidDate(value) ? value : new Date(),
    endDate: isValidDate(value) ? value : new Date(),
    focusedInput: START_DATE,
    onDatesChange: handleDateChange,
    numberOfMonths: 1,
    minBookingDate: minDate || new Date(),
    maxBookingDate: maxDate,
  });

  const { month, year } = activeMonth;

  return (
    <DatepickerContext.Provider
      value={{
        focusedDate,
        isDateFocused,
        isDateSelected,
        isDateHovered,
        isDateBlocked,
        isFirstOrLastSelectedDate,
        onDateSelect,
        onDateFocus,
        onDateHover,
        selectedDate: value,
      }}
    >
      <div
        ref={container}
        onKeyDown={preventArrowKeyScroll}
        onClick={() => {
          // prevent datepicker closing when clicking inside
          datepickerClicked.current = true;
          setTimeout(() => (datepickerClicked.current = false));
        }}
        className={styles.datepickerWrapper}
      >
        <InputWrapper
          className={className}
          id={id}
          helperText={invalidText || helperText}
          invalid={!!invalidText}
          labelText={labelText}
          hasIcon
          hideLabel={hideLabel}
        >
          <input
            name={id}
            id={id}
            ref={inputRef}
            className={classNames(inputStyles.input, styles.datepickerInput, {
              [styles.invalid]: !!invalidText,
            })}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            value={dateValue}
            onKeyDown={handleInputKeyDown}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={toggleCalendar}
            aria-label={t('common:datepicker.accessibility.buttonCalendar')}
            className={styles.iconCalendar}
          >
            <IconCalendar />
          </button>
          {isCalendarOpen && (
            <div
              className={styles.datepickerContainer}
              ref={datepickerContainer}
              role="dialog"
              aria-modal="true"
              labelled-by={dialogLabelId}
            >
              <SrOnly>
                <span aria-live="polite">{labelText}</span>
              </SrOnly>
              <div className={styles.selectorsWrapper}>
                <div>
                  <div className={styles.monthNavigation}>
                    <MonthNavButton
                      onClick={goToPreviousMonths}
                      aria-label={t(
                        'common:datepicker.accessibility.buttonPreviousMonth'
                      )}
                    >
                      <IconAngleLeft />
                    </MonthNavButton>
                    <div
                      className={styles.currentMonth}
                      aria-live="polite"
                      id={dialogLabelId}
                    >
                      {formatDate(new Date(year, month), 'LLLL yyyy', {
                        locale: dateLocales[locale],
                      })}
                    </div>
                    <MonthNavButton
                      onClick={goToNextMonths}
                      aria-label={t(
                        'common:datepicker.accessibility.buttonNextMonth'
                      )}
                    >
                      <IconAngleRight />
                    </MonthNavButton>
                  </div>
                  <div className={styles.daysContainer}>
                    <Month
                      key={`${year}-${month}`}
                      year={year}
                      month={month}
                      firstDayOfWeek={firstDayOfWeek}
                    />
                  </div>
                  <button
                    ref={closeButton}
                    className={styles.closeButton}
                    onClick={ensureCalendarIsClosed}
                    type="button"
                    tabIndex={-1}
                  >
                    {t('common:datepicker.buttonClose')}
                  </button>
                </div>
                {timeSelector && (
                  <TimesList
                    times={times}
                    datetime={value}
                    onTimeClick={handleTimeClick}
                  />
                )}
              </div>
            </div>
          )}
        </InputWrapper>
      </div>
    </DatepickerContext.Provider>
  );
};

export default Datepicker;
