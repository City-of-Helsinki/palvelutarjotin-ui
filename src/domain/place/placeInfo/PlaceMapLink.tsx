import { Button, IconMap } from 'hds-react';
import React from 'react';

import styles from './placeInfo.module.scss';

export interface PlaceMapLinkEntryProps {
  id: string;
  label: string;
  description?: string;
  url: string;
}

export interface PlaceMapLinkProps extends PlaceMapLinkEntryProps {
  variant?: 'a' | 'button';
}

const PlaceMapLink: React.FC<PlaceMapLinkProps> = ({
  id,
  label,
  description,
  url,
  variant = 'button',
}) => {
  // <a> -element variant
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

  // <button> -element variant
  return (
    <>
      <Button
        id={id}
        onClick={() => window.open(url)}
        iconLeft={<IconMap />}
        variant="supplementary"
      >
        {label}
      </Button>
      {description && <p className={styles.linkDescription}>{description}</p>}
    </>
  );
};

export default PlaceMapLink;
