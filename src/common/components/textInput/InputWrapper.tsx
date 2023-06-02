import classNames from 'classnames';
import { Tooltip } from 'hds-react';
import React, { CSSProperties, FC, ReactNode } from 'react';

import styles from './inputWrapper.module.scss';
import { RequiredIndicator } from '../requiredIndicator/RequiredIndicator';

type InputWrapperProps = {
  children?: ReactNode;
  className?: string;
  errorText?: string;
  hasIcon?: boolean;
  helperText?: string;
  hideLabel?: boolean;
  id: string;
  invalid?: boolean;
  labelId?: string;
  labelText?: string;
  style?: CSSProperties;
  tooltipLabel?: string;
  tooltipText?: string;
  tooltipOpenButtonLabelText?: string;
  tooltipCloseButtonLabelText?: string;
  required?: boolean;
};

// eslint-disable-next-line react/display-name
const InputWrapper: FC<InputWrapperProps> = React.forwardRef<
  HTMLDivElement,
  InputWrapperProps
>(
  (
    {
      children,
      className = '',
      errorText,
      hasIcon = false,
      helperText,
      hideLabel = false,
      id,
      invalid = false,
      labelId,
      labelText,
      style,
      tooltipLabel,
      tooltipText,
      tooltipOpenButtonLabelText,
      tooltipCloseButtonLabelText,
      required,
    },
    ref
  ) => (
    <div
      className={classNames(
        styles.root,
        hasIcon && styles.hasIcon,
        invalid && styles.invalid,
        className
      )}
      ref={ref}
      style={style}
    >
      {labelText && (
        <label
          id={labelId}
          htmlFor={id}
          className={`${styles.label} ${hideLabel ? styles.hiddenLabel : ''}`}
        >
          {labelText}
          {required && <RequiredIndicator />}
        </label>
      )}
      {tooltipText && (
        <Tooltip
          tooltipLabel={tooltipLabel || ''}
          buttonLabel={tooltipOpenButtonLabelText || ''}
        >
          {tooltipText}
        </Tooltip>
      )}
      <div className={classNames(styles.inputWrapper)}>{children}</div>
      {errorText && (
        <div className={styles.errorText} id={`${id}-error`}>
          {errorText}
        </div>
      )}
      {helperText && <div className={styles.helperText}>{helperText}</div>}
    </div>
  )
);

export default InputWrapper;
