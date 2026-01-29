import classNames from 'classnames';
import { FieldProps } from 'formik';
import { Select } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import type { I18nNamespace } from '../../../../types';
import { invalidFieldClass } from '../constants';
import styles from '../multiDropdownField.module.scss';
import { getErrorText } from '../utils';

type Option = {
  label: string;
  value: string;
};

type Props = FieldProps & {
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  helperText?: string;
  setFieldValue?: (
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<void>;
  hideLabel: boolean;
  className?: string;
};

const MultiDropdownField: React.FC<Props> = ({
  className,
  field: { name, onBlur, onChange, value },
  form: { errors, touched },
  options,
  placeholder,
  setFieldValue,
  hideLabel,
  disabled,
  required,
  label,
  helperText,
}) => {
  const { t } = useTranslation<I18nNamespace>();
  const errorText = getErrorText(errors, touched, name, t);

  const handleChange = (selectedOptions: Option[]) => {
    // hds-react v4 Select onChange receives an array of selected options
    const value = selectedOptions.map((item) => item.value);
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

  const selectedValues = value
    .map((item: string) => options.find((option) => option.value === item))
    .filter((i: Option | undefined) => i)
    .map((option: Option) => option.value);

  return (
    <Select
      invalid={Boolean(errorText)}
      disabled={disabled}
      required={required}
      multiSelect={true}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={handleChange as any}
      options={options}
      id={name}
      value={selectedValues}
      texts={{
        label: label || '',
        placeholder: placeholder || t('common:dropdown.placeholder'),
        error: errorText,
        ...(helperText && !errorText ? { assistive: helperText } : {}),
      }}
      className={classNames(className, {
        [invalidFieldClass]: errorText,
        [styles.hideLabel]: hideLabel,
      })}
    />
  );
};

export default MultiDropdownField;
