import classNames from 'classnames';
import { FieldProps } from 'formik';
import { Select, SelectProps } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { invalidFieldClass } from '../constants';
import { getErrorText } from '../utils';

type Option = {
  label: string;
  value: string;
};

type Props = SelectProps<Option> &
  FieldProps & {
    options: Option[];
    defaultValue: Option;
    setFieldValue?: (
      field: string,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value: any,
      shouldValidate?: boolean | undefined
    ) => Promise<void>;
  };

const DropdownField: React.FC<Props> = ({
  className,
  field: { name, onBlur, onChange, value, ...field },
  form: { errors, touched },
  helper,
  options,
  placeholder,
  setFieldValue,
  ...allRest
}) => {
  const { t } = useTranslation();
  const errorText = getErrorText(errors, touched, name, t);

  // Remove unused props
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { multiselect, ...usedRest } = allRest;

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

  const selectedValue = options.find((option) => option.value === value) || {
    label: '',
    value: '',
  };

  return (
    <Select
      {...usedRest}
      {...field}
      helper={errorText || helper}
      invalid={Boolean(errorText)}
      optionLabelField={'label'}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={handleChange as (selectedItems: any) => void}
      options={options}
      id={name}
      placeholder={placeholder || t('common:dropdown.placeholder')}
      value={selectedValue}
      className={classNames(className, { [invalidFieldClass]: errorText })}
    />
  );
};

export default DropdownField;
