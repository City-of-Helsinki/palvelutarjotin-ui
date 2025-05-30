import classNames from 'classnames';
import { FieldProps } from 'formik';
import { useTranslation } from 'next-i18next';
import * as React from 'react';

import UnitPlaceSelector from '../../../../domain/place/unitSelector/UnitPlaceSelector';
import type { I18nNamespace } from '../../../../types';
import { invalidFieldClass } from '../constants';
import { getErrorText } from '../utils';

interface Props extends FieldProps {
  className?: string;
  helperText: string;
  labelText: string;
  placeholder?: string;
  required?: boolean;
  disabled: boolean;
}

const UnitPlaceSelectorField: React.FC<Props> = (props) => {
  const { t } = useTranslation<I18nNamespace>();
  const {
    className,
    field: { name, onBlur, onChange, ...field },
    form: { errors, touched },
    required,
    helperText,
    labelText,
    placeholder,
    disabled,
  } = props;
  const invalidText = getErrorText(errors, touched, name, t);

  const handleBlur = (val: string | string[] | null) => {
    onBlur({
      target: {
        id: name,
        value: val,
      },
    });
  };

  const handleChange = (val: string | string[] | null) => {
    onChange({
      target: {
        id: name,
        value: val,
      },
    });
  };

  return (
    <UnitPlaceSelector
      {...field}
      disabled={disabled}
      id={name}
      invalidText={invalidText}
      helperText={helperText}
      labelText={labelText}
      onBlur={handleBlur}
      required={required}
      onChange={handleChange}
      placeholder={placeholder}
      className={classNames(className, { [invalidFieldClass]: invalidText })}
    />
  );
};

export default UnitPlaceSelectorField;
