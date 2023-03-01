import classNames from 'classnames';
import React, { FunctionComponent } from 'react';

import styles from './loadingSpinner.module.scss';
import IconLoadingSpinner from '../../../icons/IconLoadingSpinner';

interface Props {
  hasPadding?: boolean;
  isLoading: boolean;
}

const LoadingSpinner: FunctionComponent<Props> = ({
  hasPadding = true,
  isLoading,
  children,
}) => {
  return (
    <>
      {isLoading ? (
        <div
          className={classNames(styles.spinnerWrapper, {
            [styles.hasPadding]: hasPadding,
          })}
        >
          <div className={styles.spinner}>
            <IconLoadingSpinner />
          </div>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default LoadingSpinner;
