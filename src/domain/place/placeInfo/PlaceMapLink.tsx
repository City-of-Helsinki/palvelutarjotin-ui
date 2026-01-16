import { Button, ButtonVariant, IconMap } from 'hds-react';
import React from 'react';

import styles from './placeInfo.module.scss';

export interface PlaceMapLinkEntryProps {
  id: string;
  label: string;
  description?: string;
  url: string;
}

interface PlaceMapLinkProps extends PlaceMapLinkEntryProps {
  variant?: 'a' | 'button';
}

const PlaceMapLink: React.FC<PlaceMapLinkProps> = ({
  id,
  label,
  description,
  url,
  variant = 'button',
}) => {
  if (variant === 'a') {
    return (
      <>
        <a
          id={id}
          href={url}
          rel="noopener noreferrer"
          target="_blank"
          className={styles.linkEntry}
        >
          <IconMap className={styles.linkIcon} />
          {label}
        </a>
        {description && <p className={styles.linkDescription}>{description}</p>}
      </>
    );
  }

  return (
    <>
      <Button
        id={id}
        onClick={() => window.open(url)}
        iconStart={<IconMap className={styles.linkIcon} />}
        variant={ButtonVariant.Supplementary}
      >
        {label}
      </Button>
      {description && <p className={styles.linkDescription}>{description}</p>}
    </>
  );
};

export default PlaceMapLink;
