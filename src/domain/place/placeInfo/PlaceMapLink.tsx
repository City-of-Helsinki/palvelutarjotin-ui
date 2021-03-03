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
  const { Component, labelPrefix, props } = {
    a: {
      Component: 'a',
      labelPrefix: <IconMap className={styles.linkIcon} />,
      props: {
        href: url,
        rel: 'noopener noreferrer',
        target: '_blank',
        className: styles.linkEntry,
      },
    },
    button: {
      Component: Button,
      props: {
        onClick: () => window.open(url),
        iconLeft: <IconMap className={styles.linkIcon} />,
        variant: 'supplementary' as const,
      },
    },
  }[variant];

  return (
    <>
      <Component id={id} {...props}>
        {labelPrefix}
        {label}
      </Component>
      {description && <p className={styles.linkDescription}>{description}</p>}
    </>
  );
};

export default PlaceMapLink;
