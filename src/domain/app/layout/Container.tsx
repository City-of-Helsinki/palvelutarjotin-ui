import classnames from 'classnames';
import React, { FunctionComponent } from 'react';

import styles from './container.module.scss';

interface Props {
  className?: string;
  size?: 'default' | 'narrow';
}

const Container: FunctionComponent<Props> = ({
  children,
  className,
  size = 'default',
}) => {
  return (
    <div className={classnames(styles.container, styles[size], className)}>
      {children}
    </div>
  );
};

export default Container;
