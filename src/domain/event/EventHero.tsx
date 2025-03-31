import { IconArrowLeft } from 'hds-react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import React from 'react';

import EventImage from './eventImage/EventImage';
import styles from './eventPage.module.scss';
import { createBackButtonHref } from './utils';
import Container from '../app/layout/Container';

// Dedicated Back Button Component
const BackButton: React.FC = () => {
  const { t } = useTranslation();
  const { asPath } = useRouter();
  const [, search] = asPath.split('?');
  const href = createBackButtonHref(search);

  return (
    <NextLink href={href} aria-label={t('common:buttonBack')} scroll={true}>
      <IconArrowLeft size="m" />
    </NextLink>
  );
};

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
