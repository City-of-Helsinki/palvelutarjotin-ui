import React from 'react';

import styles from './header.module.scss';
import Navbar from './navbar/Navbar';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <Navbar />
    </header>
  );
};

export default Header;
