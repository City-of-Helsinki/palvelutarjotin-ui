import { Koros } from 'hds-react';
import React, { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import Container from '../layout/Container';
import styles from './footer.module.scss';

const Footer: FunctionComponent = () => {
  const { t } = useTranslation();

  return (
    <footer className={styles.footer}>
      <Koros className={styles.koros} />
      <Container>
        <div className={styles.contentWrapper}>
          <div className={styles.helsinkiLogo}></div>
          <div className={styles.copyright}>
            <p>{t('footer:copyrightText')}</p>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
