import React from 'react';

import styles from './formGroup.module.scss';

const FormGroup: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <div className={styles.formGroup}>{children}</div>;
};

export default FormGroup;
