import { FieldProps, FormikHelpers } from 'formik';
import React from 'react';

import DivisionSelector from '../../../../domain/neighborhood/divisionSelector/DivisionSelector';
import { MultiselectDropdownProps } from '../../multiSelectDropdown/MultiSelectDropdown';

type Option = {
  label: string;
  value: string;
};

type Props = Omit<
  MultiselectDropdownProps,
  'checkboxName' | 'onChange' | 'value'
> &
  FieldProps & {
    options: Option[];
    setFieldValue?: FormikHelpers<Option[]>['setFieldValue'];
    checkboxName: string;
  };

const DivisionSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  setFieldValue,
  checkboxName = 'divisionCheckbox',
  ...allRest
}) => {
  // Remove unused props
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { options, ...usedRest } = allRest;

  const handleChange = (val: Option | Option[]) => {
    const value = !Array.isArray(val) ? [val] : val;
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
    <DivisionSelector
      {...usedRest}
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
