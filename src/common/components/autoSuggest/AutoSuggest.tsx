import classNames from 'classnames';
import { IconCheck, IconCross } from 'hds-react';
import { useTranslation } from 'next-i18next';
import * as React from 'react';

import {
  ACCESSIBILITY_EVENT_TYPE,
  valueEventAriaMessage,
  valueFocusAriaMessage,
} from './accessibility';
import styles from './autoSuggest.module.scss';
import useKeyboardNavigation from '../../../hooks/useDropdownKeyboardNavigation';
import useLocale from '../../../hooks/useLocale';
import type { I18nNamespace, Language } from '../../../types';
import ScrollIntoViewWithFocus from '../scrollIntoViewWithFocus/ScrollIntoViewWithFocus';
import InputWrapper from '../textInput/InputWrapper';
import inputStyles from '../textInput/inputWrapper.module.scss';

export type AutoSuggestOption = {
  label: string | React.ReactElement;
  value: string;
};

interface ListOptionProps {
  index: number;
  isFocused: boolean;
  isSelected: boolean;
  onOptionClick: (option: AutoSuggestOption) => void;
  option: AutoSuggestOption;
  setFocusedIndex: (index: number) => void;
}

const ListOption: React.FC<ListOptionProps> = ({
  index,
  isFocused,
  isSelected,
  onOptionClick,
  option,
  setFocusedIndex,
}) => {
  const component = React.useRef<HTMLLIElement>(null);

  const handleOptionClick = () => {
    onOptionClick(option);
  };

  const handleMouseEnter = () => {
    setFocusedIndex(index);
  };

  const wrappedComponent = (
    // FIXME: Add keyboard listener and enable linting
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <li
      ref={component}
      key={option.value}
      className={classNames(styles.listItem, {
        [styles.isFocused]: isFocused,
        [styles.isSelected]: isSelected,
      })}
      onClick={handleOptionClick}
      onMouseEnter={handleMouseEnter}
      role="option"
      aria-selected={isSelected}
    >
      {option.label} <IconCheck />
    </li>
  );

  return (
    <ScrollIntoViewWithFocus isFocused={isFocused}>
      {wrappedComponent}
    </ScrollIntoViewWithFocus>
  );
};

export interface AutoSuggestProps {
  className?: string;
  disabled?: boolean;
  helperText?: string;
  id: string;
  inputValue: string;
  invalidText?: string;
  labelledBy?: string;
  labelText: string;
  loading?: boolean;
  onBlur: (val: AutoSuggestOption | AutoSuggestOption[] | null) => void;
  onChange: (val: AutoSuggestOption | AutoSuggestOption[] | null) => void;
  options: AutoSuggestOption[];
  optionLabelToString?: (option: AutoSuggestOption, locale: Language) => string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  setInputValue: (value: string) => void;
  value: AutoSuggestOption | AutoSuggestOption[] | null;
}

const AutoSuggest: React.FC<AutoSuggestProps> = ({
  className,
  disabled,
  helperText,
  id,
  inputValue,
  invalidText,
  labelledBy,
  labelText,
  loading,
  onBlur,
  onChange,
  optionLabelToString,
  options,
  placeholder,
  readOnly,
  setInputValue,
  value,
  required,
}) => {
  const { t } = useTranslation<I18nNamespace>();
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const [ariaLiveSelection, setAriaLiveSelection] = React.useState('');

  const input = React.useRef<HTMLInputElement>(null);

  const container = React.useRef<HTMLDivElement>(null);
  const {
    focusedIndex,
    setFocusedIndex,
    setup: setupKeyboardNav,
    teardown: teardownKeyboardNav,
  } = useKeyboardNavigation({
    container: container,
    listLength: options.length,
  });

  const focusedValue = React.useMemo(() => {
    return options.length > focusedIndex ? options[focusedIndex] : null;
  }, [focusedIndex, options]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const isComponentFocused = () => {
    const active = document.activeElement;
    const current = container.current;

    if (current && active instanceof Node && current.contains(active)) {
      return true;
    }
    return false;
  };

  const ensureMenuIsClosed = () => {
    if (isMenuOpen) {
      setInputValue('');
      setIsMenuOpen(false);
    }
  };

  const ensureMenuIsOpen = React.useCallback(() => {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
    }
  }, [isMenuOpen]);

  const ensureIsFocused = () => {
    if (!isFocused) {
      setIsFocused(true);
    }
  };

  const ensureIsNotFocused = () => {
    if (isFocused) {
      setIsFocused(false);
    }
  };

  const onDocumentClick = () => {
    // Close menu when clicking outside of the component
    if (!isComponentFocused()) {
      if (isFocused) {
        onBlur(value);
      }
      ensureIsNotFocused();
      ensureMenuIsClosed();
    }
  };

  const onDocumentFocusin = () => {
    if (isComponentFocused()) {
      ensureIsFocused();
    } else {
      if (isFocused) {
        onBlur(value);
      }

      ensureIsNotFocused();
      ensureMenuIsClosed();
    }
  };

  const selectOption = (option: AutoSuggestOption) => {
    ensureMenuIsClosed();

    if (Array.isArray(value)) {
      // Add option to value array if it doesn't already exist there
      if (!value.map((item) => item.value).includes(option.value)) {
        onChange([...value, option]);
      }
    } else {
      onChange(option);
    }

    announceAriaLiveSelection({
      event: ACCESSIBILITY_EVENT_TYPE.SELECT_OPTION,
      option,
    });

    setInputValue('');

    input.current?.focus();
  };

  const handleDocumentKeyDown = (event: KeyboardEvent) => {
    // Handle keyboard events only if current element is focused
    if (!isComponentFocused()) return;
    switch (event.key) {
      // Close menu on ESC key
      case 'Escape':
        ensureMenuIsClosed();
        break;
      case 'ArrowUp':
        ensureMenuIsOpen();
        break;
      case 'ArrowDown':
        ensureMenuIsOpen();
        break;
      case 'Enter':
        if (focusedValue) {
          selectOption(focusedValue);
          event.preventDefault();
        }
        break;
    }
  };

  React.useEffect(() => {
    if (inputValue) {
      ensureMenuIsOpen();
    }
  }, [ensureMenuIsOpen, inputValue]);

  React.useEffect(() => {
    setupKeyboardNav();
    document.addEventListener('click', onDocumentClick);
    document.addEventListener('keydown', handleDocumentKeyDown);
    document.addEventListener('focusin', onDocumentFocusin);
    // Clean up event listener to prevent memory leaks
    return () => {
      teardownKeyboardNav();
      document.removeEventListener('click', onDocumentClick);
      document.removeEventListener('keydown', handleDocumentKeyDown);
      document.removeEventListener('focusin', onDocumentFocusin);
    };
  });

  const announceAriaLiveSelection = ({
    event,
    option,
  }: {
    event: ACCESSIBILITY_EVENT_TYPE;
    option: AutoSuggestOption;
  }) => {
    setAriaLiveSelection(
      valueEventAriaMessage({
        event,
        value: optionLabelToString
          ? optionLabelToString(option, locale)
          : option.label.toString(),
        t,
      })
    );
  };

  const constructAriaLiveMessage = () => {
    const focusedValueMsg = focusedValue
      ? valueFocusAriaMessage({
          focusedValue,
          getOptionLabel: () => focusedValue.label.toString(),
          options,
          t,
        })
      : '';

    return isMenuOpen ? `${focusedValueMsg}` : '';
  };

  const clearValues = () => {
    ensureMenuIsClosed();
    onChange(Array.isArray(value) ? [] : { value: '', label: '' });
    setInputValue('');

    input.current?.focus();
  };

  const deselectOption = (option: AutoSuggestOption) => {
    // Deselecting is possible only when value is array
    if (Array.isArray(value)) {
      onChange(value.filter((item) => item.value !== option.value));

      announceAriaLiveSelection({
        event: ACCESSIBILITY_EVENT_TYPE.DESELECT_OPTION,
        option: option,
      });
    }
  };

  const hasValue = Array.isArray(value) ? !!value.length : !!value;

  // Internal components
  const liveRegion: React.ReactElement | null = isFocused ? (
    <span className={styles.a11yText} aria-live="polite">
      <p>{ariaLiveSelection}</p>
      <p>{constructAriaLiveMessage()}</p>
    </span>
  ) : null;

  const clearValueButton: React.ReactElement | null = hasValue ? (
    <button
      aria-label={t(
        'common:autoSuggest.accessibility.clearValueButtonAriaMessage'
      )}
      className={styles.removeButton}
      onClick={clearValues}
      type="button"
    >
      <IconCross />
    </button>
  ) : null;

  const singleValue: React.ReactElement | null =
    !inputValue && !Array.isArray(value) && value?.label ? (
      // FIXME: Make element accessible (e.g. using keyboard) and enable linting
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        className={styles.singleValue}
        onClick={() => {
          input.current?.focus();
        }}
      >
        {value?.label}
      </div>
    ) : null;

  const multiValue: React.ReactElement | null = Array.isArray(value) ? (
    <div className={styles.multiValueWrapper}>
      {value.map((item) => {
        return (
          <div key={item.value} className={styles.multiValue}>
            {item.label}
            <button
              aria-label={t(
                'common:autoSuggest.accessibility.deselectOptionButtonAriaMessage',
                {
                  value: optionLabelToString
                    ? optionLabelToString(item, locale)
                    : item.label.toString(),
                }
              )}
              className={styles.deselectValueButton}
              onClick={() => deselectOption(item)}
              type="button"
            >
              <IconCross />
            </button>
          </div>
        );
      })}
    </div>
  ) : null;

  const menu: React.ReactElement | null = isMenuOpen ? (
    <div className={styles.autoSuggestMenu}>
      <>
        {options.length ? (
          <ul role="listbox">
            {options.map((option, index) => {
              return (
                <ListOption
                  key={option.value}
                  index={index}
                  isFocused={focusedIndex === index}
                  isSelected={
                    Array.isArray(value)
                      ? value.map((item) => item.value).includes(option.value)
                      : value?.value === option.value
                  }
                  onOptionClick={selectOption}
                  option={option}
                  setFocusedIndex={setFocusedIndex}
                />
              );
            })}
          </ul>
        ) : (
          <div className={styles.infoMessage}>
            {loading
              ? t('common:autoSuggest.loading')
              : t('common:autoSuggest.noResults')}
          </div>
        )}
      </>
    </div>
  ) : null;

  return (
    <div className={styles.autoSuggest} ref={container}>
      {liveRegion}
      <InputWrapper
        id={id}
        helperText={helperText}
        errorText={invalidText}
        invalid={!!invalidText}
        labelText={labelText}
        className={className}
        required={required}
      >
        <input
          ref={input}
          aria-autocomplete="list"
          autoComplete="off"
          type="text"
          className={inputStyles.input}
          aria-labelledby={labelledBy}
          disabled={disabled}
          id={id}
          onChange={handleInputChange}
          placeholder={hasValue ? '' : placeholder}
          readOnly={readOnly}
          value={inputValue}
        />
        {singleValue}
        {clearValueButton}
        {menu}
      </InputWrapper>
      {multiValue}
    </div>
  );
};

export default AutoSuggest;
