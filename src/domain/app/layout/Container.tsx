import classnames from 'classnames';
import React, { FunctionComponent } from 'react';

import styles from './container.module.scss';

interface Props {
  className?: string;
  size?: 'default' | 'xsmall' | 'small';
  children?: React.ReactNode;
}

const Container: FunctionComponent<Props> = ({
  children,
  className,
  size = 'default',
}) => {
  return (
    <div className={classnames(styles.container, styles[size])}>
      <div className={className}>{children}</div>
    </div>
  );
};

export default Container;
