import React from 'react';

import styles from './header.module.scss';
import MobileNavbar from './mobileNavbar/MobileNavbar';
import Navbar from './navbar/Navbar';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <MobileNavbar className={styles.mobileNavbar} />
      <Navbar className={styles.navbar} />
    </header>
  );
};

export default Header;
