import classNames from 'classnames';
import React from 'react';
import { useSelector } from 'react-redux';

import Footer from '../footer/Footer';
import Header from '../header/Header';
import { isMobileMenuOpenSelector } from '../header/mobileMenu/selectors';
import styles from './pageLayout.module.scss';

const PageLayout: React.FC = ({ children }) => {
  const isMobileMenuOpen = useSelector(isMobileMenuOpenSelector);

  return (
    <div className={styles.pageLayout}>
      <Header />

      <div
        aria-hidden={isMobileMenuOpen}
        className={classNames(styles.pageBody, {
          [styles.mobileMenuOpen]: isMobileMenuOpen,
        })}
      >
        {children}
      </div>

      <Footer isMobileMenuOpen={isMobileMenuOpen} />
    </div>
  );
};

export default PageLayout;
