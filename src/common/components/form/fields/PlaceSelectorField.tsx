import { FieldProps, FormikHelpers } from 'formik';
import { SelectProps } from 'hds-react';
import React from 'react';

import PlaceSelector from '../../../../domain/place/placeSelector/PlaceSelector';

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
  };

const PlaceSelectorField: React.FC<Props> = ({
  field: { name, onBlur, onChange, value, ...field },
  helper,
  multiselect,
  options,
  placeholder,
  setFieldValue,
  ...rest
}) => {
  const handleChange = (val: Option | Option[]) => {
    const value = Array.isArray(val) ? val.map((item) => item) : val;
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
    <PlaceSelector
      {...rest}
      {...field}
      name={name}
      checkboxName="placesCheckboxes"
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onChange={handleChange as (selectedItems: any) => void}
      value={value}
    />
  );
};

export default PlaceSelectorField;
