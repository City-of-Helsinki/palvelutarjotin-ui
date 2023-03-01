import { useTranslation } from 'next-i18next';
import React from 'react';

import styles from './bannerHero.module.scss';
import { BANNER_IMAGE } from './constants';
import Container from '../app/layout/Container';

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
    </div>
  );
};

export default BannerHero;
