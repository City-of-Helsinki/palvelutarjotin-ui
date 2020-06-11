import React from 'react';

import Footer from '../footer/Footer';
// import Header from '../header/Header';
import styles from './pageLayout.module.scss';

const PageLayout: React.FC = ({ children }) => {
  return (
    <div className={styles.pageLayout}>
      <div>HEADER</div>

      <div className={styles.pageBody}>{children}</div>

      <Footer />
    </div>
  );
};

export default PageLayout;
