import { Koros } from 'hds-react';
import React from 'react';

import { useTranslation } from '../../i18n';
import Container from '../app/layout/Container';
import styles from './bannerHero.module.scss';
import { BANNER_IMAGE } from './constants';

const BannerHero: React.FC = ({ children }) => {
  const { t } = useTranslation();
  return (
    <div
      className={styles.bannerHeroContainer}
      test-id="banner-hero-image"
      style={{
        backgroundImage: `url(${BANNER_IMAGE})`,
      }}
    >
      <Container>
        <h1>{t('common:bannerHero.title')}</h1>
      </Container>
      {children}
      <Koros className={styles.koros} />
    </div>
  );
};

export default BannerHero;
