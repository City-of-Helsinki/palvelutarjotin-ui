import classNames from 'classnames';
import { IconAngleDown, IconAngleUp, IconSearch, Checkbox } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React, { ReactNode } from 'react';

import DropdownMenu from './DropdownMenu';
import styles from './multiSelectDropdown.module.scss';
import useKeyboardNavigation from '../../../hooks/useDropdownKeyboardNavigation';
import type { I18nNamespace } from '../../../types';
import { skipFalsyType } from '../../../utils/typescript.utils';
import ScrollIntoViewWithFocus from '../scrollIntoViewWithFocus/ScrollIntoViewWithFocus';
import SearchLabel from '../search/searchLabel/SearchLabel';

/**
 * Get the sorting key for a React element or string.
 * @param x The React element or string to get the sorting key for.
 * @returns Props of the React element as a string, or the input itself if it is a string.
 *
 * This function is used to create some consistent sorting for React elements.
 * Sorting by text content would be better, but sorting by props at least ensures some consistency.
 */
const getSortingKey = (x: React.ReactElement | string) =>
  typeof x === 'string' ? x : JSON.stringify(x.props);

/** Compare two React elements or strings for sorting. */
const reactElementOrStringCompare = (
  a: React.ReactElement | string,
  b: React.ReactElement | string
) => getSortingKey(a).localeCompare(getSortingKey(b));

const SELECT_ALL = 'SELECT_ALL';

export type Option = {
  text: string;
  value: string;
};

export interface MultiselectDropdownProps {
  checkboxName: string;
  inputPlaceholder?: string;
  inputValue?: string;
  name: string;
  icon?: ReactNode;
  onChange: (values: string[]) => void;
  options: Option[];
  fixedOptions?: Option[];
  renderOptionText?: (optionValue: string) => React.ReactElement;
  selectAllText?: string;
  setInputValue?: (newVal: string) => void;
  showSearch?: boolean;
  showSelectAll?: boolean;
  title: string;
  value: string[];
  className?: string;
  helpText?: string;
  filterByInput?: boolean;
}

const MultiSelectDropdown: React.FC<MultiselectDropdownProps> = ({
  checkboxName,
  icon,
  inputPlaceholder,
  inputValue,
  name,
  onChange,
  options,
  fixedOptions = [],
  renderOptionText,
  selectAllText,
  setInputValue,
  showSearch,
  showSelectAll,
  title,
  value,
  className,
  helpText,
  filterByInput = true,
}) => {
  const { t } = useTranslation<I18nNamespace>();
  const inputPlaceholderText =
    inputPlaceholder || t('common:multiSelectDropdown.inputPlaceholder');
  const [internalInput, setInternalInput] = React.useState('');
  const [focusStyles, setFocusStyles] = React.useState(false);
  const input = inputValue !== undefined ? inputValue : internalInput;

  const dropdown = React.useRef<HTMLDivElement | null>(null);
  const toggleButton = React.useRef<HTMLButtonElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const filteredOptions = React.useMemo<Option[]>((): Option[] => {
    const selectAllOption: Option | undefined = showSelectAll
      ? {
          text: selectAllText || t('common:multiSelectDropdown.selectAll'),
          value: SELECT_ALL,
        }
      : undefined;

    const result: Option[] = [];

    if (selectAllOption) {
      result.push(selectAllOption);
    }

    if (filterByInput) {
      result.push(
        ...options.filter((option) =>
          option.text.toLowerCase().includes(input.toLowerCase())
        )
      );
    } else {
      result.push(...options);
    }

    return result;
  }, [filterByInput, input, options, selectAllText, showSelectAll, t]);

  const handleInputValueChange = React.useCallback(
    (val: string) => {
      setInternalInput(val);

      if (setInputValue) {
        setInputValue(val);
      }
    },
    [setInputValue]
  );

  const handleToggleFocusStyles = () => setFocusStyles((prev) => !prev);

  const {
    focusedIndex,
    setup: setupKeyboardNav,
    teardown: teardownKeyboardNav,
  } = useKeyboardNavigation({
    container: dropdown,
    listLength: fixedOptions.length + filteredOptions.length,
    onKeyDown: (event: KeyboardEvent) => {
      // Handle keyboard events only if current element is focused
      if (!isComponentFocused()) return;

      switch (event.key) {
        // Close menu on ESC key
        case 'Escape':
          setIsMenuOpen(false);
          setFocusToToggleButton();
          break;
        case 'ArrowUp':
          ensureDropdownIsOpen();
          break;
        case 'ArrowDown':
          ensureDropdownIsOpen();
          break;
        case 'Enter':
          if (isToggleButtonFocused()) {
            handleToggleButtonClick();
          } else {
            setIsMenuOpen(false);
            setFocusToToggleButton();
          }
          event.preventDefault();
      }
    },
  });
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const isComponentFocused = () => {
    const active = document.activeElement;
    const current = dropdown.current;
    return !!current?.contains(active);
  };

  const handleDocumentClick = (event: MouseEvent) => {
    const target = event.target;
    const current = dropdown.current;

    // Close menu when clicking outside of the component
    if (!(target instanceof Node && current?.contains(target))) {
      setIsMenuOpen(false);
    }
  };

  const toggleOption = React.useCallback(
    (option: string) => {
      onChange(
        value.includes(option)
          ? value.filter((v) => v !== option)
          : [...value, option]
      );
    },
    [onChange, value]
  );

  const ensureDropdownIsOpen = React.useCallback(() => {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
    }
  }, [isMenuOpen]);

  const isToggleButtonFocused = () => {
    const active = document.activeElement;
    const current = toggleButton.current;
    return !!current?.contains(active);
  };

  const setFocusToToggleButton = () => {
    toggleButton.current?.focus();
  };

  const toggleMenu = React.useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  const handleDocumentFocusin = (event: FocusEvent) => {
    const target = event.target;
    const current = dropdown.current;

    if (!(target instanceof Node && current?.contains(target))) {
      setIsMenuOpen(false);
    }
  };

  React.useEffect(() => {
    setupKeyboardNav();
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('focusin', handleDocumentFocusin);
    // Clean up event listener to prevent memory leaks
    return () => {
      teardownKeyboardNav();
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('focusin', handleDocumentFocusin);
    };
  }, [setupKeyboardNav, teardownKeyboardNav]);

  const setFocusToInput = () => {
    inputRef.current?.focus();
  };

  const handleToggleButtonClick = () => {
    toggleMenu();

    setTimeout(() => {
      if (!isMenuOpen) {
        setFocusToInput();
      }
    }, 0);
  };

  const handleClear = React.useCallback(() => {
    onChange([]);
    handleInputValueChange('');
  }, [handleInputValueChange, onChange]);

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    if (val === SELECT_ALL) {
      handleClear();
    } else {
      toggleOption(val);
    }
  };

  const handleEnterKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    const val = event.currentTarget.value;
    if (event.key === 'Enter') {
      if (val === SELECT_ALL) {
        handleClear();
      } else {
        toggleOption(val);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleInputValueChange(event.target.value);
  };

  const selectedText = React.useMemo(() => {
    const valueLabels = value
      .map((val) => {
        if (renderOptionText) {
          return renderOptionText(val);
        } else {
          const result = options.find((option) => option.value === val);
          return result ? result.text : null;
        }
      })
      .filter(skipFalsyType)
      .sort(reactElementOrStringCompare);

    if (valueLabels.length > 1) {
      return (
        <>
          {valueLabels[0]} + {valueLabels.length - 1}
        </>
      );
    }
    return valueLabels[0];
  }, [options, renderOptionText, value]);

  React.useEffect(() => {
    if (!isMenuOpen) {
      handleInputValueChange('');
    }
  }, [handleInputValueChange, isMenuOpen]);

  const createDropdownOptions = (option: Option, index: number) => {
    const isFocused = index === focusedIndex;
    const isChecked =
      option.value === SELECT_ALL
        ? !value.length
        : value.includes(option.value);

    const setFocus = (ref: HTMLInputElement) => {
      if (isFocused && ref) {
        ref.focus();
      }
    };

    return (
      <ScrollIntoViewWithFocus
        className={classNames(styles.dropdownItem, {
          [styles['dropdownItem--first']]: index === 0,
          [styles['dropdownItem--isFocused']]: isFocused,
        })}
        key={option.value}
        isFocused={isFocused}
      >
        <Checkbox
          ref={setFocus}
          checked={isChecked}
          id={`${checkboxName}_${option.value}`}
          label={option.text}
          name={checkboxName}
          onChange={handleValueChange}
          onKeyDown={handleEnterKeyPress}
          value={option.value}
        />
      </ScrollIntoViewWithFocus>
    );
  };

  return (
    <div className={classNames(styles.dropdown, className)} ref={dropdown}>
      <button
        type="button"
        aria-label={title}
        className={styles.toggleButton}
        onClick={handleToggleButtonClick}
        ref={toggleButton}
        onFocus={handleToggleFocusStyles}
        onBlur={handleToggleFocusStyles}
      >
        <div className={styles.iconWrapper}>{icon}</div>
        <div className={styles.title}>
          <SearchLabel htmlFor={name} srOnly={true}>
            {title}
          </SearchLabel>
          {selectedText ? (
            <div className={styles.titleText}>{selectedText}</div>
          ) : (
            <div className={styles.placeholder}>{title}</div>
          )}
        </div>
        <div
          className={classNames(
            styles.arrowWrapper,
            focusStyles ? styles.focused : ''
          )}
        >
          {isMenuOpen ? <IconAngleUp /> : <IconAngleDown />}
        </div>
      </button>
      <DropdownMenu isOpen={isMenuOpen} onClear={handleClear}>
        {showSearch && (
          <div className={styles.inputWrapper}>
            <IconSearch size="s" />
            <SearchLabel htmlFor={name} srOnly={true}>
              {inputPlaceholderText}
            </SearchLabel>
            <input
              ref={inputRef}
              id={name}
              name={name}
              placeholder={inputPlaceholderText}
              onChange={handleInputChange}
              value={input}
              autoComplete="off"
            />
          </div>
        )}
        {helpText && <div className={styles.helpText}>{helpText}</div>}
        {filteredOptions.map(createDropdownOptions)}
        {fixedOptions.length > 0 && filteredOptions.length > 0 && (
          <hr className={styles.separator} />
        )}
        {fixedOptions.map((option, index) =>
          // the filtered optiosn are rendered first in the same dropdown,
          // so the index must be now started from the end of filtered options list
          createDropdownOptions(option, index + filteredOptions.length)
        )}
      </DropdownMenu>
    </div>
  );
};

export default MultiSelectDropdown;
