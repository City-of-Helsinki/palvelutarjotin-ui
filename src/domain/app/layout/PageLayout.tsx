import React from 'react';

import Footer from '../footer/Footer';
import Header from '../header/Header';
import styles from './pageLayout.module.scss';

export const MAIN_CONTENT_ID = 'main-content';

const PageLayout: React.FC = ({ children }) => {
  return (
    <div className={styles.pageLayout}>
      <Header />
      <div className={styles.pageBody} id={MAIN_CONTENT_ID}>
        {children}
      </div>
      <Footer />
    </div>
  );
};

export default PageLayout;
