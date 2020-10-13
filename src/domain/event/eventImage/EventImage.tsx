import React from 'react';

import { useTranslation } from '../../../i18n';
import styles from './eventImage.module.scss';

interface EventImageProps {
  imageUrl?: string;
  imageAltText?: string | null;
  photographerName?: string | null;
}

const EventImage: React.FC<EventImageProps> = ({
  imageUrl,
  imageAltText,
  photographerName,
}) => {
  const { t } = useTranslation();

  return (
    <div className={styles.imageContainer}>
      <img
        className={styles.eventImage}
        src={imageUrl}
        alt={imageAltText ?? undefined}
      />
      {photographerName && (
        <div className={styles.photographerText}>
          {t('event:photographerText', {
            photographer: photographerName,
          })}
        </div>
      )}
    </div>
  );
};

export default EventImage;
