import classNames from 'classnames';
import { FieldProps } from 'formik';
import { Checkbox, CheckboxProps } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { invalidFieldClass } from '../constants';
import { getErrorText } from '../utils';

type Props = FieldProps & CheckboxProps;

const CheckboxField: React.FC<Props> = (props) => {
  const {
    field: { name, ...field },
    form: { errors, touched },
    className,
    ...rest
  } = props;

  const { t } = useTranslation();
  const errorText = getErrorText(errors, touched, name, t);

  return (
    <Checkbox
      {...field}
      {...rest}
      id={name}
      checked={field.value}
      className={classNames(className, { [invalidFieldClass]: errorText })}
    />
  );
};

export default CheckboxField;
