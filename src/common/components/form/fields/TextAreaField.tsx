import { FieldProps } from 'formik';
import { TextArea, TextAreaProps } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { invalidFieldClass } from '../constants';
import { getErrorText } from '../utils';

type Props = FieldProps & Omit<TextAreaProps, 'form'>;

const TextAreaField: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const {
    field: { name, ...field },
    form: { errors, touched },
    helperText,
    rows = 10,
    ...rest
  } = props;
  const errorText = getErrorText(errors, touched, name, t);

  return (
    <TextArea
      {...field}
      {...rest}
      id={name}
      rows={rows}
      helperText={errorText || helperText}
      invalid={!!errorText}
      className={errorText ? invalidFieldClass : undefined}
    />
  );
};

export default TextAreaField;
