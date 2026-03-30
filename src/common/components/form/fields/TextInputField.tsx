import classNames from 'classnames';
import { FieldProps } from 'formik';
import { TextInput, TextInputProps } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { I18nNamespace } from '../../../../types';
import { invalidFieldClass } from '../constants';
import { getErrorText } from '../utils';

type Props = FieldProps & Omit<TextInputProps, 'form'>;

const InputField: React.FC<Props> = (props) => {
  const { t } = useTranslation<I18nNamespace>();
  const {
    field: { name, ...field },
    form: { errors, touched },
    helperText,
    ...rest
  } = props;
  const errorText = getErrorText(errors, touched, name, t);

  return (
    <TextInput
      {...field}
      {...rest}
      id={name}
      helperText={helperText}
      errorText={errorText}
      invalid={!!errorText}
      className={classNames(
        {
          [invalidFieldClass]: errorText,
        },
        props.className
      )}
    />
  );
};

export default InputField;
