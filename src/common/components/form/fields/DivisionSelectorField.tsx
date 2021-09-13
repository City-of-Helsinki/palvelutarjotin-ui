import { FieldProps, FormikHelpers } from 'formik';
import { SelectProps } from 'hds-react';
import React from 'react';

import DivisionSelector from '../../../../domain/neighborhood/divisionSelector/DivisionSelector';

type Option = {
  label: string;
  value: string;
};

type Props = SelectProps<Option> &
  FieldProps & {
    options: Option[];
    title: string;
    inputPlaceholder: string;
    setFieldValue?: FormikHelpers<Option[]>['setFieldValue'];
    checkboxName: string;
  };

const DivisionSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  helper,
  multiselect,
  options,
  placeholder,
  setFieldValue,
  checkboxName = 'divisionCheckbox',
  ...rest
}) => {
  const handleChange = (val: Option | Option[]) => {
    const value = !Array.isArray(val) ? [val] : val;
    if (setFieldValue) {
      setFieldValue(name, value);
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
    <DivisionSelector
      {...rest}
      {...field}
      name={name}
      checkboxName={checkboxName}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={handleChange as (selectedItems: any) => void}
      value={value ?? []}
    />
  );
};

export default DivisionSelectorField;
