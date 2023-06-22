import classNames from 'classnames';
import { FieldProps } from 'formik';
import { Select, SelectProps } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { invalidFieldClass } from '../constants';
import styles from '../multiDropdownField.module.scss';
import { getErrorText } from '../utils';

type Option = {
  label: string;
  value: string;
};

type Props = SelectProps<Option> &
  FieldProps & {
    defaultValue: Option[];
    setFieldValue?: (
      field: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: any,
      shouldValidate?: boolean | undefined
    ) => Promise<void>;
    hideLabel: boolean;
    clearButtonAriaLabel: string;
    selectedItemRemoveButtonAriaLabel: string;
  };

const MultiDropdownField: React.FC<Props> = ({
  className,
  field: { name, onBlur, onChange, value, ...field },
  form: { errors, touched },
  helper,
  options,
  placeholder,
  setFieldValue,
  hideLabel,
  ...rest
}) => {
  const { t } = useTranslation();
  const errorText = getErrorText(errors, touched, name, t);

  const handleChange = (val: Option | Option[]) => {
    const value = Array.isArray(val)
      ? val.map((item) => item.value)
      : val.value;
    if (setFieldValue) {
      (async () => await setFieldValue(name, value))();
    } else {
      onChange({
        target: {
          id: name,
          value,
        },
      });
    }

    setTimeout(() => {
      // Automatically call onBlur event to make formik set touched value to true
      onBlur({
        target: {
          id: name,
        },
      });
    });
  };

  return (
    <Select
      {...rest}
      {...field}
      helper={errorText ? '' : helper}
      error={errorText}
      invalid={Boolean(errorText)}
      optionLabelField={'label'}
      multiselect={true}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={handleChange as (selectedItems: any) => void}
      options={options}
      id={name}
      placeholder={placeholder || t('common:dropdown.placeholder')}
      value={value
        .map((item: string) => options.find((option) => option.value === item))
        .filter((i: Option | undefined) => i)}
      className={classNames(className, {
        [invalidFieldClass]: errorText,
        [styles.hideLabel]: hideLabel,
      })}
      // clearButtonAriaLabel="clearButtonAriaLabel"
      // selectedItemRemoveButtonAriaLabel="selectedItemRemoveButtonAriaLabel"
    />
  );
};

export default MultiDropdownField;
