import { useTranslation } from 'next-i18next';
import React from 'react';

import { BackButton } from './BackButton';
import EventImage from './eventImage/EventImage';
import styles from './eventPage.module.scss';
import Container from '../app/layout/Container';

export const EventHero: React.FC<{
  imageUrl?: string;
  imageAltText?: string | null;
  photographerName?: string | null;
}> = ({ imageAltText, imageUrl, photographerName }) => {
  const { t } = useTranslation();

  return (
    <div className={styles.eventHero}>
      <Container className={styles.backButtonContainer}>
        <BackButton />
      </Container>
      <EventImage
        imageUrl={imageUrl}
        imageAltText={imageAltText || t('event:eventImageAltText')}
        photographerName={photographerName}
      />
    </div>
  );
};
