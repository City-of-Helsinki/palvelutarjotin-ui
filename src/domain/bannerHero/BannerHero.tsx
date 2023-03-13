import { Koros } from 'hds-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

import styles from './bannerHero.module.scss';
import { BANNER_IMAGE } from './constants';
import Container from '../app/layout/Container';

const BannerHero: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { t } = useTranslation();
  return (
    <>
      <div className={styles.bannerHeroUpperText}>
        <Container>
          <h1>{t('common:bannerHero.topTitle')}</h1>
          <h2>{t('common:bannerHero.middleTitle')}</h2>
          <h3>{t('common:bannerHero.bottomTitle')}</h3>
        </Container>
      </div>
      <div className={styles.bannerHeroContainer}>
        <div
          className={styles.bannerHeroImage}
          test-id="banner-hero-image"
          style={{
            backgroundImage: `url(${BANNER_IMAGE})`,
          }}
        >
          <Koros className={styles.korosTop} />
          <div className={styles.bannerHeroSpacer} />
          <Koros className={styles.korosBottom} />
        </div>
        <div className={styles.bannerHeroOverlay}>{children}</div>
      </div>
    </>
  );
};

export default BannerHero;
